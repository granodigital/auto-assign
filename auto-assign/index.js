const { Toolkit } = require('actions-toolkit');
const { sample, isString, sumBy } = require('lodash');
const retry = require('async-retry');

module.exports = class AutoAssigner {
	constructor (options) {
		this.tools = new Toolkit();
		this.options = options;
	}

	async run() {
		this.github = this.tools.createOctokit();

		// console.log(this.tools.context);
		const event = this.tools.context.event;
		if (event !== 'issues' && event !== 'pull_request') {
			console.error(`Invalid event type "${event}"! Accepted: issues, pull_request`);
			process.exit(1);
		}

		// Ignore all other events except "opened".
		/* const action = this.tools.context.payload.action;
		if (action !== 'opened') {
			console.log('Skipped action', event, action);
			process.exit(78);
		} */

		let users = new Set();

		// Add users from command line.
		if (this.options.user) {
			users.add(Array.isArray(this.options.user) ? this.options.user : [this.options.user]);
		}

		// Add users from contributors.
		if (this.options.contributors) {
			users = new Set([...users, ...(await this.getContributors())]);
		}

		// Make sure the creator of the issue/PR is excluded.
		users.delete(this.tools.context.actor);

		console.log('Resolved users:', users);

		if (users.size > 0) {
			// Assign
			if (this.options.assign) {
				const assignee = sample([...users]);
				console.log('Assigning', assignee, 'from', users);
				await this.github.issues
					.addAssignees(this.tools.context
						.issue({ assignees: [assignee] }));
			}
			// Request review
			if (this.options.review) {
				const reviewer = sample([...users]);
				const teams = this.options.team;
				console.log('Requesting review from', reviewer, 'from', users, 'and', teams);
				await this.github.pullRequests
					.createReviewRequest(this.tools.context.issue({
						reviewers: [reviewer],
						team_reviewers: isString(teams) ? [teams] : teams
					}));
			}
		}
	}

	async getContributors() {
		console.log('Getting contributors', this.tools.context.repo());
		// Counts the sum of commits from the last _count_ weeks.
		const sumOfCommits = (weeks, count = 8) => sumBy(weeks.slice(-count), week => week.c);
		const data = await retry(async bail => {
			const response = await this.github.repos.getContributorsStats(this.tools.context.repo());
			if (`${response.status}`.startsWith('4')) {
				// @ts-ignore
				bail(new Error(response.message));
				return;
			}
			if (response.status === 202) {
				throw new Error('Crunching numbers');
			}
			return response.data;
		}, { retries: 4 });
		if (!Array.isArray(data)) return [];
		const users = data
			// Is a real human and last weeks' commit activity >= 1
			.filter(contrib => {
				console.log(contrib.author.login, 'made', sumOfCommits(contrib.weeks), 'commits');
				return contrib.author.type === 'User' && sumOfCommits(contrib.weeks) >= 1;
			})
			.map(contrib => contrib.author.login);
		return users;
	}
}