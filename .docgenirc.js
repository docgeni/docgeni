module.exports = {
    $schema: './packages/cli/cli.schema.json',
    title: 'Doc Generator',
    shortName: 'Docgeni',
    description: 'A modern documentation generator for doc and Angular Lib',
    output: 'docs-site',
    docsPath: 'docs',
    sitePath: 'packages/site',
    navs: [
        {
            title: '指南',
            path: 'guides',
            items: [
                {
                    title: '介绍',
                    items: [
                        {
                            title: '介绍',
                            path: '',
                            content: 'Docgeni 是一个现代化，简单好用的文档生成工具'
                        },
                        {
                            title: '开始使用',
                            path: 'getting-started',
                            content: '开始使用'
                        }
                    ]
                },
                {
                    title: '组件示例',
                    items: [
                        {
                            title: '如何写组件示例',
                            path: 'how-write-component-demo',
                            content: '组件'
                        },
                        {
                            title: '组件示例的渲染',
                            path: 'component-demo-render',
                            content: '组件示例如何渲染'
                        }
                    ]
                }
            ]
        },
        {
            title: '设计',
            path: 'design',
            items: [
                {
                    title: '设计原则',
                    path: '',
                    content: '设计原则'
                },
            ]
        },
        {
            title: '组件',
            path: 'components',
            lib: 'alib'
        },
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
        },
        {
            title: '更新日志',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
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
                    locals: {
                        "en-us":"General"
                    }
                },
                {
                    id: 'layout',
                    title: '布局',
                    locals: {
                        "en-us":"Layout"
                    }
                }
            ]
        }
    ]
};
