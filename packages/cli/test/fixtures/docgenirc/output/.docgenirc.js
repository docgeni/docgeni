/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'lite',
    title: 'test-workspace',
    description: '',
    docsDir: 'docs',
    navs: [
        null,
        {
            title: 'Components',
            path: 'components',
            lib: 'lib-test',
            locales: {}
        }
    ],
    libs: [
        {
            name: 'lib-test',
            rootDir: 'projects/lib-test',
            include: [
                'src',
                'src/lib'
            ],
            apiMode: 'automatic',
            categories: []
        }
    ]
};
