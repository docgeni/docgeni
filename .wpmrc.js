module.exports = {
    defaultBranch: 'master',
    bumpFiles: [
        'package.json',
        './packages/site/package.json',
        {
            filename: './packages/template/package.json',
            type: 'json'
        },
        {
            filename: './packages/cli/src/version.ts',
            type: 'code'
        }
    ],
    skip: {
        changelog: true
    },
    commitAll: true,
    hooks: {
        prepublish: 'yarn run build && yarn update-package-json',
        postpublish: 'lerna publish from-git && yarn pub:template',
        prereleaseBranch: 'yarn sync-template-version --version {{version}}',
        postreleaseBranch: 'lerna version {{version}} && git add .'
    }
};
