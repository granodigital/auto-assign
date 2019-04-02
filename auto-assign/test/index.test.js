const AutoAssigner = require('..');

describe('auto-assign', () => {
	let aa;

	beforeEach(() => (aa = new AutoAssigner()));

	it('should have a run method', () => {
		expect(typeof aa.run).toBe('function');
	});

	describe('run', () => {
		it('should resolve users and assign them', async () => {
			const users = new Set(['tero.testaaja']);
			aa.options.assign = true;
			jest.spyOn(aa, 'resolveUsers').mockResolvedValueOnce(users);
			const assignSpy = jest.spyOn(aa, 'assign').mockResolvedValueOnce({});
			await aa.run();
			expect(assignSpy).toHaveBeenCalledWith(users);
		});

		it('should resolve users and request revies from them', async () => {
			const users = new Set(['tero.testaaja']);
			aa.options.review = true;
			jest.spyOn(aa, 'resolveUsers').mockResolvedValueOnce(users);
			const assignSpy = jest.spyOn(aa, 'requestReview').mockResolvedValueOnce({});
			await aa.run();
			expect(assignSpy).toHaveBeenCalledWith(users);
		});
	});

	describe('requestReview', () => {
		it('should call github api with a reviewer', async () => {
			const reviewSpy = jest
				.spyOn(aa.tools.github.pulls, 'createReviewRequest')
				.mockResolvedValueOnce({});
			await aa.requestReview(new Set(['tero.testaaja']));
			expect(reviewSpy).toHaveBeenCalledWith({
				number: 2,
				owner: 'granodigital',
				repo: 'grano-github-actions',
				reviewers: ['tero.testaaja'],
				team_reviewers: undefined
			});
		});

		it('should call github api with a team', async () => {
			const reviewSpy = jest
				.spyOn(aa.tools.github.pulls, 'createReviewRequest')
				.mockResolvedValueOnce({});
			aa.options.team = 'ecommerce-developers';
			await aa.requestReview(new Set([]));
			expect(reviewSpy).toHaveBeenCalledWith({
				number: 2,
				owner: 'granodigital',
				repo: 'grano-github-actions',
				reviewers: [],
				team_reviewers: ['ecommerce-developers']
			});
		});

		it('should not call api if no reviewers', async () => {
			const reviewSpy = jest
				.spyOn(aa.tools.github.pulls, 'createReviewRequest')
				.mockResolvedValueOnce({});
			await aa.requestReview(new Set([]));
			expect(reviewSpy).not.toHaveBeenCalled();
		});
	});

	describe('assign', () => {
		it('should call github api with assignee', async () => {
			const assignSpy = jest
				.spyOn(aa.tools.github.issues, 'addAssignees')
				.mockResolvedValueOnce({});
			await aa.assign(new Set(['tero.testaaja']));
			expect(assignSpy).toHaveBeenCalledWith({
				assignees: ['tero.testaaja'],
				number: 2,
				owner: 'granodigital',
				repo: 'grano-github-actions'
			});
		});

		it('should not call api if no reviewers', async () => {
			const assignSpy = jest
				.spyOn(aa.tools.github.issues, 'addAssignees')
				.mockResolvedValueOnce({});
			await aa.assign(new Set([]));
			expect(assignSpy).not.toHaveBeenCalled();
		});
	});

	describe('resolveUsers', () => {
		it('should return users from the command line options', async () => {
			aa.options.user = 'test';
			let users = await aa.resolveUsers();
			expect(users).toEqual(new Set(['test']));
			aa.options.user = ['test', 'test2'];
			users = await aa.resolveUsers();
			expect(users).toEqual(new Set(['test', 'test2']));
		});

		it('should determine repo contributors', async () => {
			jest.spyOn(aa, 'getContributors').mockResolvedValueOnce(['test', 'test2']);
			aa.options.contributors = true;
			let users = await aa.resolveUsers();
			expect(users).toEqual(new Set(['test', 'test2']));
		});

		it('should get team members if not requesting review', async () => {
			aa.options.review = false;
			aa.options.team = 'test-team';
			jest.spyOn(aa, 'getTeamMembers').mockResolvedValueOnce(['test', 'test2']);
			let users = await aa.resolveUsers();
			expect(users).toEqual(new Set(['test', 'test2']));
		});

		it('should not get team members if requesting review', async () => {
			aa.options.review = true;
			aa.options.team = 'test-team';
			jest.spyOn(aa, 'getTeamMembers').mockResolvedValueOnce(['test', 'test2']);
			let users = await aa.resolveUsers();
			expect(users).toEqual(new Set([]));
		});

		it('should remove actor from the results (the person opening the PR/issue)', async () => {
			aa.options.user = ['test', 'granoecom'];
			let users = await aa.resolveUsers();
			expect(users).toEqual(new Set(['test']));
		});
	});

	describe('getTeamMembers', () => {
		it('should get a list of members from a team', async () => {
			aa.options.team = 'ecommerce-developers';
			const users = await aa.getTeamMembers();
			expect([...users]).toEqual(
				expect.arrayContaining([
					'villelahdenvuo',
					'laxu',
					'Hallian',
					'nicou',
					'juhosuominen'
				])
			);
		});

		it('should handle multiple teams', async () => {
			aa.options.team = ['ecommerce-developers', 'test'];
			jest.spyOn(aa.tools.github.teams, 'getByName')
				.mockResolvedValueOnce({ data: { id: 1 } })
				.mockResolvedValueOnce({ data: { id: 2 } });
			jest.spyOn(aa.tools.github.teams, 'listMembers')
				.mockResolvedValueOnce({ data: [{ login: 'foo' }, { login: 'bar' }] })
				.mockResolvedValueOnce({ data: [{ login: 'bar' }, { login: 'baz' }] });

			const users = await aa.getTeamMembers();
			expect([...users]).toEqual(expect.arrayContaining(['foo', 'bar', 'baz']));
		});
	});
});
