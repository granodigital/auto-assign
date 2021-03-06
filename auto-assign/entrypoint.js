const AutoAssigner = require('.');
const minimist = require('minimist');

const ARGS_OPTIONS = {
	boolean: ['contributors', 'assign', 'review'],
	string: ['team', 'user'],
	alias: {
		team: 't',
		user: 'u',
		contributors: 'c',
		assign: 'a',
		review: 'r'
	}
};

const options = minimist(process.argv.slice(2), ARGS_OPTIONS);

if (process.env.USER_TOKEN) {
	console.log('Overriding GITHUB_TOKEN');
	process.env.GITHUB_TOKEN = process.env.USER_TOKEN;
}

new AutoAssigner(options)
	.run()
	.then(() => {
		console.log('Auto Assigner ran successfully');
	})
	.catch(error => {
		console.error(`Auto Assigner failed ${error.stack}`);
		process.exit(1);
	});
