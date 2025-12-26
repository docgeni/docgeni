module.exports = {
    allowBranch: ['master', 'next', 'v1.0.*'],
    bumpFiles: [
        'package.json',
        './packages/site/package.json',
        {
            filename: './packages/template/package.json',
            type: 'json',
        },
        {
            filename: './packages/cli/src/version.ts',
            type: 'code',
        },
    ],
    skip: {
        changelog: true,
        branch: true,
        commit: true,
    },
    commitAll: true,
    hooks: {
        prepublish: 'yarn run build',
        postbump: 'yarn sync-template-version --version {{version}} && yarn lerna version {{version}} && git add .',
    },
};
