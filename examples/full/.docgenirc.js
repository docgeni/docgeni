/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'full',
    title: 'Full Mode',
    description: 'A documentation generator for Angular',
    docsDir: 'docs',
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
        }
    ],
    libs: [
        {
            name: 'alib',
            rootDir: './src',
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
            key: 'zh-cn',
            name: 'ZH-CN'
        },
        {
            key: 'en-us',
            name: 'EN'
        }
    ],
    defaultLocale: 'en-us'
};
