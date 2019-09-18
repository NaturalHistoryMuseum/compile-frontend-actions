const fs = require('fs');
const path = require('path');

const core = require('@actions/core');
const less = require('less');
const glob = require('glob');

try {
  // pull out the expected action parameters
  const target = core.getInput('target');
  const destination = core.getInput('destination');

  let modifiedFiles = 0;

  for (let filename of glob.sync(target)) {
    const lessOptions = {
      // this sets the context for less so it knows where to look for relative imports in the less
      'paths': [path.dirname(filename)]
    };
    // read and then render the less source
    less.render(fs.readFileSync(filename, 'utf8'), lessOptions).then(output => {
      // figure out the name of the output file simply by replacing the .less with .css in the
      // file name
      let destinationFilename = path.basename(filename).replace('.less', '.css');
      let outputFile = '';
      if (!destination) {
        // no destination specified by the user so we default to the same directory as the less
        // source was found in
        outputFile = path.join(path.dirname(filename), destinationFilename);
      } else {
        // if the destination provided by the user ends in a slash, assume they want this path
        // treated as a directory and add the destination css file name we generated above,
        // otherwise just use the provided destination as if it's a full file path
        if (destination.endsWith(path.sep)) {
          outputFile = path.join(destination, destinationFilename);
        }
      }
      // write the css out to the output file location
      fs.writeFileSync(outputFile, output.css, { 'encoding': 'utf8' });
      console.log(`Compiled ${destinationFilename} -> ${outputFile}`);
      modifiedFiles++;
    }).catch(err => {
      core.setFailed(err.message);
    });
  }

  core.setOutput('modified_files', modifiedFiles);
} catch (error) {
  core.setFailed(error.message);
}
