const { Toolkit } = require('actions-toolkit');

module.exports = class AutoAssigner {
	constructor () {
		this.tools = new Toolkit()
		this.github = this.tools.createOctokit();
	}

	async run() {
		console.log(tools.context);
	}
}