const fs = require('fs');
const path = require('path');

const core = require('@actions/core');
const less = require('less');
const glob = require('glob');
const sha1 = require("crypto-js/sha1");


(async () => {
  try {
    // pull out the expected action parameters
    const target = core.getInput('target');
    const destination = core.getInput('destination');
    let modified = core.getInput('modified');

    try {
      modified = JSON.parse(modified);
    } catch (err) {
      modified = [];
    }

    for (let filename of glob.sync(target)) {
      const lessOptions = {
        // this sets the context for less so it knows where to look for relative imports in the less
        'paths': [path.dirname(filename)]
      };
      // read and then render the less source
      output = await less.render(fs.readFileSync(filename, 'utf8'), lessOptions);

      // figure out the name of the output file simply by replacing the .less with .css in the
      // file name
      let defaultFilename = path.basename(filename).replace('.less', '.css');
      // default to write location of the css to the destination provided by the caller
      let outputFile = destination;
      if (!outputFile) {
        // no destination specified by the user so we default to the same directory as the less
        // source file was found in
        outputFile = path.join(path.dirname(filename), defaultFilename);
      } else {
        // if the destination provided by the user ends in a slash, assume they want this path
        // treated as a directory and add the default .css file name we generated above
        if (outputFile.endsWith(path.sep)) {
          outputFile = path.join(destination, defaultFilename);
        }
      }

      // if the target output file location exists and has the same hash as the css we just
      // generated then we should carry on as there is nothing to do
      if (fs.existsSync(outputFile)) {
        const currentHash = sha1(fs.readFileSync(outputFile, 'utf8'));
        const newHash = sha1(output.css);
        if (currentHash.toString() === newHash.toString()) {
          console.log(`Skipping ${path.basename(filename)} as ${outputFile} is already up to date`);
          continue;
        }
      }

      // write the css out to the output file location
      fs.writeFileSync(outputFile, output.css, { 'encoding': 'utf8' });
      console.log(`Compiled ${path.basename(filename)} -> ${outputFile}`);
      modified.push(outputFile);
    }

    core.setOutput('modified', JSON.stringify(modified));
  } catch (error) {
    core.setFailed(error.message);
  }
})();
