module.exports = [
    {
        type: 'directive',
        name: 'alibBar',
        properties: [
            {
                name: 'alibType',
                type: 'string',
                default: 'null',
                description: '类型'
            },
            {
                name: 'alibSize',
                type: 'string',
                description: '大小'
            }
        ]
    },
    {
        type: 'component',
        name: 'alib-bar-divider',
        description: '分割线',
        properties: []
    }
];
