/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'full',
    title: 'Docgeni',
    logoUrl: 'https://cdn.worktile.com/open-sources/docgeni/logos/docgeni.png',
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
            path: 'https://github.com/docgeni/docgeni/blob/master/CHANGELOG.md',
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
            include: ['common'],
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
    ],
    locales: [
        {
            key: 'en-us',
            name: 'EN'
        },
        {
            key: 'zh-cn',
            name: '中文'
        }
    ],
    defaultLocale: 'zh-cn'
};
