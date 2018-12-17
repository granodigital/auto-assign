const { Toolkit } = require('actions-toolkit');
const { sample, isString } = require('lodash');

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
		const action = this.tools.context.payload.action;
		if (action !== 'opened') {
			process.exit(78);
		}

		let users = new Set();

		if (this.options.collaborators) {
			users = new Set([...users, ...(await this.getCollaborators())]);
		}

		// Make sure the creator of the issue/PR is excluded.
		users.delete(this.tools.context.actor);

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

	async getCollaborators() {
		const response = await this.github.repos.getContributorsStats(this.tools.context.repo());
		const users = response.data
			// Last week's commit activity > 1
			.filter(contrib => contrib.weeks.pop().c > 1)
			.map(contrib =>contrib.author.login);
		return users;
	}
}