---
title: 组件API
path: 'api'
order: 20
---

## 支持的格式
组件目录下的`api`文件夹下存放每个多语言对应的组件API文档，会展示在组件的API中，`Docgeni`会根据配置的`locales`查找`{localeKey}.json`文件，目前支持 `.json`、`.yaml`、`.yml`、`.js`、`.config.js` 5种后缀，`json`、`yaml`、`js`三种格式。

## API 配置
不管是哪种格式，组件模块会包含多个组件或者指令，所以API的配置是一个数组，数组中的每一项代表一个组件或者一个指令。

```js
module.exports = [
  {
    type: 'directive',
    name: 'alibButton',
    description: '按钮组件，支持 alibButton 指令和 alib-button 组件两种形式',
    properties: [
        {
            name: 'alibType',
            type: 'string',
            default: 'primary',
            description: '按钮的类型，支持 \`primary | info | warning | danger\`' 
        },
        {
            name: 'alibSize',
            type: 'string',
            default: 'null', 
            description: '按钮的大小，支持 \`sm | md | lg\`'
        }
    ]
  }
];

```
