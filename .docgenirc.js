module.exports = {
    $schema: './packages/cli/cli.schema.json',
    baseHref: '/',
    heads: [],
    mode: 'site',
    title: 'Docgeni',
    heading: 'Doc Generator',
    description: 'A modern documentation generator for doc and Angular Lib',
    docsPath: 'docs',
    sitePath: 'packages/site',
    output: 'docgeni-site',
    repoUrl: 'https://github.com/docgeni/docgeni',
    navs: [
        null,
        {
            title: '组件',
            path: 'components',
            lib: 'alib',
            locales: {
                'en-us': {
                    title: 'Components'
                }
            }
        },
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
        },
        {
            title: '更新日志',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true,
            locales: {
                'en-us': {
                    title: 'Changelog'
                }
            }
        }
    ],
    libs: [
        {
            name: 'alib',
            rootPath: './packages/a-lib',
            categories: [
                {
                    id: 'general',
                    title: '通用',
                    locales: {
                        'en-us': {
                            title: 'General'
                        }
                    }
                },
                {
                    id: 'layout',
                    title: '布局',
                    locales: {
                        'en-us': {
                            title: 'Layout'
                        }
                    }
                }
            ]
        }
    ]
};
