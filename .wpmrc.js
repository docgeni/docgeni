module.exports = {
    defaultBranch: 'master',
    bumpFiles: [
        'package.json',
        './packages/site/package.json',
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
        postpublish: 'lerna publish from-git && yarn pub:template',
        prereleaseBranch: 'yarn sync-template-version --version {{version}}',
        postreleaseBranch: 'lerna version {{version}} && git add .'
    }
};
