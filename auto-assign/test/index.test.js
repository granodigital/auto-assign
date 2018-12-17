const AutoAssigner = require('..');

require('dotenv').load({ path: `${__dirname}/./fixtures/env` })
process.env.GITHUB_EVENT_PATH = `${__dirname}/./fixtures/event.json`;

describe('auto-assign', () => {
	let aa, github;

	beforeEach(() => {
		github = {};
		aa = new AutoAssigner();
		aa.tools.createOctokit = jest.fn(() => github)
	});

	it('should have a run method', () => {
		expect(typeof aa.run).toBe('function');
	});
});


