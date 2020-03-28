import { DocgeniConfig } from '@docgeni/template';

export const config: DocgeniConfig = {
    title: 'Docgeni',
    description: 'Documentation Generator for Angular Components and markdown docs',
    navs: [
        {
            title: '指南',
            path: 'guides',
            children: [
                {
                    title: '介绍',
                    path: '',
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
                    path: '',
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
            children: [
                {
                    title: '基本',
                    path: '',
                    children: [
                        {
                            title: '按钮',
                            path: 'button',
                            content: '按钮组件'
                        },
                        {
                            title: 'Icon',
                            path: 'button',
                            content: 'Icon组件'
                        }
                    ]
                },
                {
                    title: '布局',
                    path: '',
                    children: [
                        {
                            title: '布局',
                            path: 'layout',
                            content: '布局组件'
                        },
                        {
                            title: 'Grid',
                            path: 'grid',
                            content: 'Grid组件'
                        }
                    ]
                }
            ]
        },
        {
            title: 'GitHub',
            path: 'https://github.com/tethys-org/docgeni',
            isExternal: true
        },
        {
            title: '更新日志',
            path: 'https://github.com/tethys-org/docgeni',
            isExternal: true
        }
    ]
};
