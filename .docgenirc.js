/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'full',
    title: 'Docgeni',
    description: '为 Angular 组件开发场景而生的文档工具',
    logoUrl: 'https://cdn.pingcode.com/open-sources/docgeni/logo.png',
    repoUrl: 'https://github.com/docgeni/docgeni',
    // algolia: {
    //     appId: 'EQYQQ0VW2G',
    //     apiKey: 'd5ade9b542071796c2a4e9bea5e73063',
    //     indexName: 'docgeni'
    // },
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
    defaultLocale: 'zh-cn',
    sitemap: {
        host: 'https://docgeni.org'
    },
    footer: `Open-source MIT Licensed | Copyright © 2020-present Powered by <a href="https://pingcode.com" target="_blank">PingCode</a><br />
    <div class="beian"><a href="https://beian.miit.gov.cn/" target="_blank" class="beian-icp">京ICP备13017353号-13</a><a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802034808" class="beian-public-security"><img src="assets/images/obtain-icp.png"> 京公网安备 11010802034808号 </a></div>`,
    example: {
        dependencies: {
            '@angular/animations': '~10.2.4',
            '@angular/cdk': '^10.2.7',
            '@angular/common': '~10.2.4',
            '@angular/compiler': '~10.2.4',
            '@angular/core': '~10.2.4',
            '@angular/forms': '~10.2.4',
            '@angular/platform-browser': '~10.2.4',
            '@angular/platform-browser-dynamic': '~10.2.4',
            rxjs: '~6.5.4',
            'zone.js': '~0.10.2',
            '@docgeni/alib': '0.0.1'
        }
    }
};
