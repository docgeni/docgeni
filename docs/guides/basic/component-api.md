---
title: 组件API
path: 'component-api'
order: 60
---

# 支持格式
组件目录下的`api`文件夹下存放每个多语言对应的组件API文档，会展示在组件的API中，`Docgeni`会根据配置的`locales`查找`{localeKey}.<json|yaml|yml|js|config.js>`文件，目前支持以下三种格式：
- `json`格式，以`.json`后缀命名
- `yaml`格式，以`.yaml`或者`yml`后缀命名
- `js`格式，以`.js`或者`.config.js`后缀命名

# API 配置
不管是哪种格式，组件模块会包含多个组件或者指令，所以API的配置是一个数组，数组中的每一项代表一个组件或者一个指令。

JS 格式示例如下：
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

YAML 格式示例如下：

```yaml
- type: directive
  name: alibButton
  description: '按钮组件，支持 alibButton 指令和 alib-button 组件两种形式'
  properties:
      - name: alibType
        type: string
        description: 按钮的类型，支持 `primary | info | warning | danger`
        default: primary
      - name: alibSize
        type: string
        description: '按钮的大小，支持 \`sm | md | lg\`'alib-button 时，只能使用该参数控制类型
        default: md
```

JSON格式示例如下：
```json
[
  {
    "type": "directive",
    "name": "alibButton",
    "description": "按钮组件，支持 alibButton 指令和 alib-button 组件两种形式",
    "properties": [
      {
        "name": "alibType",
        "type": "string",
        "default": "primary",
        "description": "按钮的类型，支持 `primary | info | warning | danger`"
      },
      {
        "name": "alibSize",
        "type": "string",
        "default": "null",
        "description": "按钮的大小，支持 `sm | md | lg`"
      }
    ]
  }
]
```

# 参数说明

- `type`: 件的类型，目前支持`directive`和`component`
- `name`: 组件的名称
- `description`: 组件的描述，支持 Markdown 语法
- `properties`: 组件的属性列表
- `properties.name`: 属性名称
- `properties.type`: 属性类型
- `properties.default`: 属性的默认值
- `properties.description`: 属性的描述，支持 Markdown 语法
