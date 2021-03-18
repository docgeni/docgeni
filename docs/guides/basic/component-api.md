---
title: 组件API
path: 'component-api'
order: 60
---

# API 默认规则
Docgeni 默认会扫描`api`文件夹下的配置文件，文件名为多语言的`Key`，比如`zh-cn.js`。如需配置，请查看 [apiDir](https://docgeni.org/configuration/lib#apiDir) 配置项。

配置文件命名规则为：`{localeKey}.<json|yaml|yml|js|config.js>`，目前支持以下三种格式：
- `json`格式，以`.json`后缀命名
- `yaml`格式，以`.yaml`或者`yml`后缀命名
- `js`格式，以`.js`或者`.config.js`后缀命名

# API 配置
不管是哪种格式，一个组件模块可能会包含多个组件或者指令，所以API的配置是一个数组，数组中的每一项代表一个组件、一个指令、一个服务或者一个接口等。

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

- `type`: 件的类型，支持`directive`、`component`、`class`、`interface`
- `name`: 组件的名称
- `description`: 组件的描述，支持 Markdown 语法
- `properties`: 组件的属性列表
- `properties.name`: 属性名称
- `properties.type`: 属性类型
- `properties.default`: 属性的默认值
- `properties.description`: 属性的描述，支持 Markdown 语法
