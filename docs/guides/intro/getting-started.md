---
title: 快速上手
path: 'getting-started'
order: 30
toc: menu
---

本文介绍如何在现有或新建项目中跑起 Docgeni 文档站。更完整的配置见各指南章节。

## 环境准备

确保本地成功安装了 [Node](https://nodejs.org/en/) 和 NPM，Node >= 10.0.0。

```
$ node -v
v10.0.0
```

## 方式一：CLI 初始化（推荐）

在**已有 Angular 项目**或空目录中执行以下任一命令：

<tabs mode="code-group">
 <tab label="npx">
```bash
npx @docgeni/cli init
```
 </tab>
  <tab label="docgeni">
```bash
docgeni init
```
 </tab>
 <tab label="ng">
```bash
ng add @docgeni/cli
```
 </tab>
</tabs>

<alert>使用 `docgeni init` 需先全局安装 CLI：`npm install -g @docgeni/cli`<br>
使用 `ng add @docgeni/cli` 需先全局安装 Angular CLI：`npm install -g @angular/cli`</alert>

交互过程中一般会：

1. 选择站点模式：`full`（带首页）或 `lite`（默认，直接进入文档）
2. 指定文档目录（默认 `docs`）

<img class="mb-2" width="90%" style="padding-left: 5%;" src="./assets/images/cli-init.png?4" />

完成后执行：

```bash
npm run start:docs
```

浏览器访问 [http://127.0.0.1:4600](http://127.0.0.1:4600)。

`lite` 模式预览效果：

![](assets/images/lite-preview.png)

<alert type="info">你正在浏览的本站（docgeni 官方文档）使用的是 `full` 模式；上图仅为 `lite` 模式界面示意。</alert>

## 方式二：GitHub 模板

想快速体验完整能力，可使用官方模板 [docgeni-template](https://github.com/docgeni/docgeni-template)（默认 `full` 模式，内置示例类库 `alib`）：

1. 打开 [模板仓库](https://github.com/docgeni/docgeni-template)
2. 点击 **Use this template** 生成自己的仓库
3. 克隆后 `npm install`，再 `npm run start:docs`

<img class="mt-2" src="./assets/images/use-docgeni-template.png" />

![](assets/images/template-preview.png)

## 方式三：手动安装

适合需要完全掌控依赖与配置的场景。

### 安装依赖

::: code-group

```bash [npm]
npm i @docgeni/cli @docgeni/template --save-dev
```

```bash [yarn]
yarn add @docgeni/cli @docgeni/template -D
```

:::

在 `package.json` 增加脚本：

```json
{
  "scripts": {
    "start:docs": "docgeni serve --port 4600",
    "build:docs": "docgeni build"
  }
}
```

### 配置

在根目录创建配置文件即可，支持 `.docgenirc.js`、`.docgenirc.ts`、`.docgenirc.yaml`、`.docgenirc.yml`、`.docgenirc.json` 等格式，任选其一。下面以 `.docgenirc.js` 为例：

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
            isExternal: true,
        },
    ],
};
```

### 开始写文档

Docgeni 默认会扫描 `docs` 目录下的 Markdown 文件，我们可以先创建一个最简单的文档。

```bash
mkdir docs && echo 'Hello Docgeni!' > docs/getting-started.md
```

执行 `npm run start:docs` 运行并打开 `http://127.0.0.1:4600` 地址访问试试。

### 忽略生成目录

构建会在 `.docgeni/site` 生成临时 Angular 站点，建议加入 `.gitignore`：

```
.docgeni/site
```

## 编写组件文档

若项目中有 Angular 类库，初始化时 Docgeni 会尝试自动接入。**没有概览或示例的组件不会出现在导航中**。

最小示例：类库下有 `button` 组件，在 `button/doc` 中创建默认语言文件（如 `zh-cn.md` 或 `en-us.md`，文件名与 `defaultLocale` 一致）：

```markdown
---
title: 按钮
subtitle: Button
---

## 何时使用

按钮用于触发一个即时操作。
```

效果示意：

![Component](assets/images/component-button.png)

概览、示例目录、`api`、`<example />` 等说明见 [组件文档](../basic/component)。
