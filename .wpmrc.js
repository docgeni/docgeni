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
        prepublish: 'yarn run build',
        prereleaseBranch: 'yarn sync-template-version --version {{version}}',
        postreleaseBranch: 'lerna version {{version}} && git add .'
    }
};
