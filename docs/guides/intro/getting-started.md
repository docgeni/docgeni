---
title: 快速开始
path: 'getting-started'
order: 30
---
# 环境准备
确保本地成功安装了 [Node](https://nodejs.org/en/) 和 NPM，Node >= 10.0.0。
```
$ node -v
v10.0.0
```

# 脚手架初始化
切换到已有的项目中，执行如下命令：
```
$ npx @docgeni/cli init
# 或者
$ ng add @docgeni/cli
```
> 使用`ng add @docgeni/cli`初始化需要全局安装 Angular CLI `npm install -g @angular/cli`

执行上述命令后将自动完成 docgeni 的初始化配置，包括生成配置文件、NPM 启动脚本、默认文档等工作。
- 第一步选择站点模式: `full`或者`lite`(默认`lite`)
- 第二步提示输入文档目录 (默认`docs`)

<img class="mb-2" src="https://cdn.pingcode.com/open-sources/docgeni/cli-init.png?4" />

初始化后，使用`npm run start:docs`启动文档站点，浏览器打开`http://127.0.0.1:4600` 即可访问。

# 手动初始化
## 安装
新建一个文件夹，或者切换到已有的项目中，执行下面命令安装 Docgeni CLI 和模版：

```bash
$ npm i @docgeni/cli @docgeni/template --save-dev
# or 
$ yarn add @docgeni/cli @docgeni/template -D
```

安装后在`package.json`文件中添加如下脚本：

```json
{
  "scripts": {
    ...
    "start:docs": "docgeni serve --port 4600",
    "build:docs": "docgeni build"
    ...
  }
}
```
## 配置
在根目录新建 `.docgenirc.js` 配置文件，拷贝如下配置代码:

```ts
/**
 * @type {import('@docgeni/core').DocgeniConfig}
 */
module.exports = {
    mode: 'lite',
    title: 'Docgeni',
    repoUrl: 'https://github.com/docgeni/docgeni',
    navs: [
        null,
        {
            title: 'GitHub',
            path: 'https://github.com/docgeni/docgeni',
            isExternal: true
        }
    ]
}
```
## 开始写文档

Docgeni 默认会自动查看`docs`目录下的 Markdown 文件，我们可以先创建一个最简单的文档。

```base
$ mkdir docs && echo 'Hello Docgeni!' > docs/getting-started.md
```

执行 `npm run start:docs` 运行并打开 `http://127.0.0.1:4600` 地址访问试试


# 组件文档
Docgeni 初始化脚手架会自动检测并添加当前 Angular 项目中的类库，类库的组件如果没有编写文档和示例，则不会显示，可以按照[组件概览](https://docgeni.org/guides//basic/component-overview)文档要求编写组件文档和示例，比如：组件根目录下有一个按钮组件，在`button`组件文件夹下创建一个`doc/zh-cn.md`文档，输入如下内容：

```
---
title: 按钮
---

## 何时使用
按钮用于开始一个即时操作。
```
展示效果如下:

![Component](https://cdn.pingcode.com/open-sources/docgeni/component-display.png)

关于组件文档更多的配置参考：[组件概览](https://docgeni.org/guides/basic/component-overview)
