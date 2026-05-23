module.exports = {
    allowBranch: ['master', 'next', 'v1.0.*'],
    packages: [
        {
            path: './packages/cli',
            bumpFiles: [
                'package.json',
                {
                    filename: './src/version.ts',
                    type: 'code',
                },
            ],
        },
        {
            path: './packages/core',
            bumpFiles: ['package.json'],
        },
        {
            path: './packages/toolkit',
            bumpFiles: ['package.json'],
        },
        {
            path: './packages/ngdoc',
            bumpFiles: ['package.json'],
        },
        {
            path: './packages/template',
            bumpFiles: ['package.json'],
        },
        {
            path: './packages/create-docgeni',
            bumpFiles: ['package.json'],
        },
    ],
    bumpFiles: ['package.json'],
    skip: {
        changelog: false,
        branch: false,
        commit: false,
    },
    commitAll: true,
    hooks: {
        prepublish: 'yarn run build',
    },
};
