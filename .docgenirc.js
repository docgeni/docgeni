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
            children: [
                {
                    title: '介绍',
                    children: [
                        {
                            title: '介绍',
                            path: '',
                            content: '开始使用'
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
                    children: [
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
            path: 'design'
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
            rootPath: './packages/a-lib'
        }
    ]
};
