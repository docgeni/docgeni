---
title: Front Matter
order: 40
toc: menu
---

## title

- 类型：`string`
- 默认：`文件夹名，文件名`

频道、类别、页面或者组件的标题，默认会使用`titleCase`命名转换文件夹名或者文件名。

## subtitle

- 类型：`string`
- 默认：`null`

频道、类别、页面或者组件的子标题，会显示在标题后面。

## order

- 类型：`number`
- 默认：`null`

频道、类别、页面或者组件的排序，按照数字升序。

## path
- 类型：`string`
- 默认：`文件夹名、文件名`

频道、页面、组件的路由，默认会使用`paramCase`命名转换文件夹名或者文件名，文档实际访问路由会带上分类和频道的 path。

## hidden
- 类型：`boolean`
- 默认：`false`

是否隐藏当前频道、类别、组件或者页面，一般用于草稿中的文档。

## name
- 类型：`string`
- 默认：`文件夹名`

组件的名称，根据此名称生成组件名，一般无需设置。

## category
- 类型：`string`
- 默认：`null`

组件的所属类别，需要和对应类库配置的 `categories` id 属性对应。

## toc <label>1.1.0+</label>
- 类型：`content | menu | hidden | false`
- 默认：`content`

文档目录显示方式，值为`content`表示在内容区域右侧显示，值为`menu`时会将当前路由的目录展示在左侧菜单中，其他值表示不显示目录，默认为 [全局配置](/configuration/global#toc)。

## label <label>1.1.0+</label>
- 类型：`string`
- 默认：`null`

组件的标签，如果是新组件，设置为`new`，如果组件已经被遗弃，设置为`deprecated`，如果组件是实验组件，设置为`experimental`，可以被设置成为任意在类库中配置的 id，配置标签参考：[labels](configuration/lib#labels)。

## background <label>2.0+</label>
- 类型：`string`
- 默认：`null`

组件示例渲染的背景色。

## compact <label>2.0+</label>
- 类型：`boolean`
- 默认：`false`

去除组件示例渲染间距。

## className <label>2.0+</label>
- 类型：`string`
- 默认：`null`

组件示例渲染的样式类，控制特殊样式处理。

