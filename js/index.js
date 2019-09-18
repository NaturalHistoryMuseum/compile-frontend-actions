const fs = require('fs');
const path = require('path');

const core = require('@actions/core');
const github = require('@actions/github');
const terser = require('terser');
const glob = require('glob');

try {
  // pull out the expected action parameters
  const target = core.getInput('target');
  const destination = core.getInput('destination');

  // setup the terser minification options
  const terserOptions = {
    compress: true,
    mangle: true
  };

  let modifiedFiles = 0;

  for (let filename of glob.sync(target)) {
    console.log(filename);
    // skip already minified js files
    if (filename.endsWith('.min.js')) {
      continue;
    }

    // read and then render the javascript source
    let result = terser.minify(fs.readFileSync(filename, 'utf8'), terserOptions);
    console.log('1');
    if (result.error) {
      console.log('2');
      throw result.error;
    }
    // figure out the name of the output file simply by replacing the .js with .min.js in the file
    // name
    console.log('3');
    let destinationFilename = path.basename(filename).replace('.js', '.min.js');
    let outputFile = '';
      if (!destination) {
        // no destination specified by the user so we default to the same directory as the
        // javascript source was found in
        outputFile = path.join(path.dirname(filename), destinationFilename);
      } else {
        // if the destination provided by the user ends in a slash, assume they want this path
        // treated as a directory and add the destination .min.js file name we generated above,
        // otherwise just use the provided destination as if it's a full file path
        if (destination.endsWith(path.sep)) {
          outputFile = path.join(destination, destinationFilename);
        }
      }
      // write the minified js out to the output file location
      fs.writeFileSync(outputFile, result.code, {'encoding': 'utf8'});
      console.log(`Minified ${destinationFilename} -> ${outputFile}`);
      modifiedFiles++;
  }

  core.setOutput('modified_files', modifiedFiles);
} catch (error) {
  core.setFailed(error.message);
}
