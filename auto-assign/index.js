const { Toolkit } = require('actions-toolkit');

module.exports = class AutoAssigner {
	constructor () {
		this.tools = new Toolkit()
	}

	async run() {
		this.github = this.tools.createOctokit();
		console.log(this.tools.context);

		const event = this.tools.context.event;
		if (event !== 'issues' && event !== 'pull_request') {
			console.error(`Invalid event type "${event}"! Accepted: issues, pull_request`);
			process.exit(1);
		}

	}
}