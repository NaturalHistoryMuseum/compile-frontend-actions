const github = require('@actions/github');
const core = require('@actions/core');

const token = core.getInput('token');
const message = core.getInput('message');

const octokit = new github.GitHub(token);

console.log(github.context);

octokit.git.createCommit(
    message,
)
