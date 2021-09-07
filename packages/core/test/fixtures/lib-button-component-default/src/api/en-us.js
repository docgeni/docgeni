module.exports = [
    {
        type: 'directive',
        name: 'alibButton',
        properties: [
            {
                name: 'alibType',
                type: 'string',
                default: 'null',
                description: 'Type of Button'
            },
            {
                name: 'alibSize',
                type: 'string',
                description: 'Size of Button'
            }
        ]
    }
];
