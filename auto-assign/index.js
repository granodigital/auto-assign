const { Toolkit } = require('actions-toolkit');
const { sample, isString, sumBy } = require('lodash');
const retry = require('async-retry');

module.exports = class AutoAssigner {
	constructor(options = {}) {
		this.tools = new Toolkit({
			event: ['issues', 'pull_request']
		});
		this.options = options;
	}

	async run() {
		const users = await this.resolveUsers();

		if (this.options.assign) {
			await this.assign(users);
		}
		if (this.options.review) {
			await this.requestReview(users);
		}
	}

	async requestReview(users) {
		const reviewer = sample([...users]);
		const teams = this.options.team;
		if (reviewer || teams) {
			console.log(
				'Requesting review from',
				reviewer || 'no one',
				'from',
				users,
				'and teams',
				teams || 'none'
			);
			await this.tools.github.pulls.createReviewRequest({
				...this.tools.context.issue,
				reviewers: reviewer ? [reviewer] : [],
				team_reviewers: isString(teams) ? [teams] : teams
			});
		}
	}

	async assign(users) {
		const assignee = sample([...users]);
		if (assignee) {
			console.log('Assigning', assignee);
			await this.tools.github.issues.addAssignees({
				...this.tools.context.issue,
				assignees: [assignee]
			});
		}
	}

	async resolveUsers() {
		let users = new Set();

		// Add users from command line.
		if (this.options.user) {
			const usersToAdd = Array.isArray(this.options.user)
				? this.options.user
				: [this.options.user];
			console.log('Found', usersToAdd.length, 'users.');
			users = new Set([...users, ...usersToAdd]);
		}

		// Add users from contributors.
		if (this.options.contributors) {
			const usersToAdd = await this.getContributors();
			console.log('Found', usersToAdd.length, 'contributors.');
			users = new Set([...users, ...usersToAdd]);
		}

		// Add users from teams unless requesting review (the whole team is requested).
		if (this.options.team && !this.options.review) {
			const usersToAdd = await this.getTeamMembers();
			console.log('Found', usersToAdd.size, 'team members.');
			users = new Set([...users, ...usersToAdd]);
		}

		// Make sure the creator of the issue/PR is excluded.
		users.delete(this.tools.context.actor);

		console.log('Resolved users:', users);
		return users;
	}

	async getTeamMembers() {
		const teams = Array.isArray(this.options.team) ? this.options.team : [this.options.team];
		console.log('Getting team members', teams.join(', '));
		let users = new Set();
		for await (const slug of teams) {
			// TODO: Support more than 100 members per team.
			// @ts-ignore
			const team = await this.tools.github.teams.getByName({
				org: this.tools.context.repo.owner,
				team_slug: slug
			});
			const members = await this.tools.github.teams.listMembers({
				team_id: team.data.id,
				per_page: 100
			});
			users = new Set([...users, ...members.data.map(member => member.login)]);
		}
		return users;
	}

	async getContributors() {
		console.log('Getting contributors', { ...this.tools.context.repo });
		// Counts the sum of commits from the last _count_ weeks.
		const sumOfCommits = (weeks, count = 8) => sumBy(weeks.slice(-count), week => week.c);
		const data = await retry(
			async bail => {
				const response = await this.tools.github.repos.getContributorsStats({
					...this.tools.context.repo
				});
				if (`${response.status}`.startsWith('4')) {
					// @ts-ignore
					bail(new Error(response.message));
					return;
				}
				if (response.status === 202) {
					throw new Error('Crunching numbers');
				}
				return response.data;
			},
			{ retries: 4 }
		);
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
};
