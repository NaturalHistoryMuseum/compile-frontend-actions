const github = require('@actions/github');
const core = require('@actions/core');
const git = require('isomorphic-git');
const fs = require('fs');

git.plugins.set('fs', fs);


(async () => {
    try {
        const dir = process.cwd();
        const token = core.getInput('token');
        const message = core.getInput('message');
        let modified = core.getInput('modified');

        // modified is expected to be a json serialised list of files that have been modified in the
        // step chain so far
        try {
            modified = JSON.parse(modified);
        } catch (err) {
            // if it was not provided or was crap, default it to []
            modified = [];
        }

        if (modified.length === 0) {
            console.log('No changes specificied, nothing to do...');
        } else {
            const branch = github.context.ref.split('/')[2];
            console.log(`Checking out branch ${branch}`);

            // checkout the branch
            await git.checkout({ dir, branch });

            // stage all the modified files
            for (const filepath of modified) {
                await git.add({ dir, filepath });
            }

            // configure the author (if needed)
            const name = await git.config({ dir, path: 'user.name' });
            const email = await git.config({ dir, path: 'user.email' });
            if (!name || !email) {
                await git.config({
                    dir,
                    path: 'user.name',
                    value: github.context.actor
                });
                await git.config({
                    dir,
                    path: 'user.email',
                    value: `${github.context.actor}@users.noreply.github.com`
                });
            }

            // create the commit
            const sha = await git.commit({ dir, message: message });
            console.log(`Commit created, sha: ${sha}`);

            // push
            const pushResponse = await git.push({
                dir,
                remote: 'origin',
                ref: branch,
                username: github.context.actor,
                password: token
            })
            // report any errors we had during the push
            if (pushResponse.errors) {
                pushResponse.errors.forEach(error => {
                    core.setFailed(error);
                });
            } else {
                console.log(`Successfully pushed commit`);
            }
        }
    } catch (err) {
        core.setFailed(err);
    }
})();
