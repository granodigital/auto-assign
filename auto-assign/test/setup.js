const { noop } = require('lodash');
const nock = require('nock');

// nock.recorder.rec();
nock.disableNetConnect();

require('dotenv').load({ path: `${__dirname}/./fixtures/env` });
process.env.GITHUB_EVENT_PATH = `${__dirname}/./fixtures/event.json`;
require('./fixtures/github'); // Mock Github API.

jest.spyOn(console, 'log').mockImplementation(noop);
