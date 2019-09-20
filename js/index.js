const fs = require('fs');
const path = require('path');

const core = require('@actions/core');
const terser = require('terser');
const glob = require('glob');
const sha1 = require("crypto-js/sha1");

try {
    // pull out the expected action parameters
    const target = core.getInput('target');
    const destination = core.getInput('destination');
    let modified = core.getInput('modified');

    // modified is expected to be a json serialised list of files that have been modified in the
    // step chain so far
    try {
        modified = JSON.parse(modified);
    } catch (err) {
        // if it was not provided or was crap, default it to []
        modified = [];
    }

    // setup the terser minification options (these are the defaults but might as well be explicit)
    const terserOptions = {
        compress: true,
        mangle: true
    };

    for (let filename of glob.sync(target)) {
        // skip already minified js files
        if (filename.endsWith('.min.js')) {
            continue;
        }

        // read and then render the javascript source
        let result = terser.minify(fs.readFileSync(filename, 'utf8'), terserOptions);
        if (result.error) {
            throw result.error;
        }

        // figure out the default name of the output file simply by replacing the .js with .min.js
        // in the file name
        const defaultFilename = path.basename(filename).replace('.js', '.min.js');
        // default the write location of the minified js to the destination provided by the caller
        let outputFile = destination;
        if (!outputFile) {
            // no destination specified by the caller so we default to the same directory as the
            // javascript source was found in
            outputFile = path.join(path.dirname(filename), defaultFilename);
        } else {
            // if the destination provided by the caller ends in a slash, assume they want this path
            // treated as a directory and add the destination .min.js file name we generated above
            if (outputFile.endsWith(path.sep)) {
                outputFile = path.join(destination, defaultFilename);
            }
        }

        // if the target output file location exists and has the same hash as the minified code we
        // just generated then we should skip this file as there is nothing to do
        if (fs.existsSync(outputFile)) {
            const currentHash = sha1(fs.readFileSync(outputFile, 'utf8'));
            const newHash = sha1(result.code);
            if (currentHash.toString() === newHash.toString()) {
                console.log(`Skipping ${path.basename(filename)} as ${outputFile} is already up to date`);
                continue;
            }
        }

        // write the minified js out to the output file location
        fs.writeFileSync(outputFile, result.code, { 'encoding': 'utf8' });
        console.log(`Minified ${path.basename(filename)} -> ${outputFile}`);
        modified.push(outputFile);
    }

    // pass on the modified output
    core.setOutput('modified', JSON.stringify(modified));
} catch (error) {
    core.setFailed(error.message);
}
