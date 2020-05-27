module.exports = {
    defaultBranch: 'master',
    bumpFiles: [
        'package.json',
        {
            filename: './packages/template/package.json',
            type: 'json'
        }
    ],
    skip: {
        changelog: true
    },
    commitAll: true,
    hooks: {
        prepublish: 'yarn run build',
        postpublish: 'lerna publish from-git && npm run pub-template',
        postreleaseBranch: 'lerna version {{version}} && git add .'
    }
};
