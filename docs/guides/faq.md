---
title: "常见问题"
---

## 如何部署到域名的非根目录?
执行 build 命令的时候传入 `base-href` 即可实现自定义，或者在配置文件夹中配置`baseHref`属性。

`docgeni build --prod --base-href=/xxx/`

## Docgeni 支持其他框架吗？
不支持，Docgeni 目前是一款为 Angular 框架量身打造的文档生成工具。

## 组件`doc`文件夹下新建了`zh-cn.md`，但是组件在文档中不展示？
Docgeni 会扫描类库`rootDir`和`include`下的一级文件夹作为一个组件，每个组件下的`doc`文件夹存放了以多语言为key的组件文档，更多参考 [类库配置](configuration/lib#rootdir)。
- 确认该组件是否包含在`rootDir`或者`include`中
- 确定 [docDir](configuration/lib#docdir) 是否指定了其他文件夹
- 确定 [defaultLocal](configuration/global#defaultlocale)（默认语言）是否为`zh-cn`
