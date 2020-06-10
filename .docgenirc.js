module.exports = {
    $schema: './packages/cli/cli.schema.json',
    baseHref: '/',
    heads: [],
    mode: 'site',
    title: 'Docgeni',
    logoUrl: 'https://cdn.worktile.com/open-sources/docgeni/logos/docgeni.png',
    docsPath: './docs',
    sitePath: 'packages/site',
    output: 'dist/docs-site',
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
            rootDir: './packages/a-lib',
            exclude: '',
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
