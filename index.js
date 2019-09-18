const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `target` input defined in action metadata file
  const target = core.getInput('target');
  const destination = core.getInput('destination');
  console.log(github.context);
  console.log(`Target: ${target}!`);
  console.log(`Destination: ${destination}!`);
  core.setOutput("modified_files", 23);
} catch (error) {
  core.setFailed(error.message);
}
