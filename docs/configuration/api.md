---
title: API 注释
path: 'api'
order: 50
toc: menu
---

Docgeni 通过 JSDoc 注释标签，为组件、指令、服务、管道、类、接口及其属性与方法自动生成 API 文档。

```ts
/**
 * General Button Component description.
 * @name alib-button
 * @order 1
 */
@Component({
    selector: 'alib-button,[alibButton]',
    template: '<ng-content></ng-content>',
})
export class AlibButtonComponent extends Base implements OnInit {

    /**
     * Button Type: `'primary' | 'secondary' | 'danger'`
     * @description 按钮类型
     * @default primary
     * @type 'primary' | 'secondary' | 'danger'
     */
    @Input() set alibButton(value: string) {
        this.alibType = value;
    }

    ngOnInit(): void {}
}


```

## @name

- 类型：`string`
- 默认：`{ClassName}`

API 文档中显示的名称。组件、指令、服务、类、接口默认取类名，管道默认取 `name`。

## @description

- 类型：`string`
- 默认：`null`

描述信息。若存在 `@description` 标签，则以其内容为准；否则使用注释正文作为描述。

```ts
/**
 * Default description.
 * @name alib-button
 * @description This is description
 * @order 1
 */
```

## @order

- 类型：`number`
- 默认：`null`

API 文档的排序权重，数值越小越靠前。

## @private

- 类型：`boolean`
- 默认：`false`
- 别名：`internal`

以下成员默认会生成 API 文档：

- 所有组件、指令、服务、管道
- 组件/指令的 `@Input` 与 `@Output` 属性
- 组件、指令、服务、管道的公开方法

若某项为内部实现、无需对外展示，可添加 `@private` 或 `@internal` 将其排除。

```ts
/**
 * General Button Component description.
 * @private
 */
```

## @public

- 类型：`boolean`
- 默认：`false`
- 别名：`publicApi`

类（Class）与接口（Interface）默认不会生成 API 文档。若需要将其纳入文档，需添加 `@public` 或 `@publicApi` 标记。

```ts
/**
 * Some Class description.
 * @public
 */
export class SomeClass {}
```

## @default

- 类型：`string`
- 默认：`null`

属性的默认值会优先从 TypeScript 赋值语句中读取，也可通过 `@default` 手动指定。

```ts
export class AlibButtonComponent {
  /**
  * Button Type
  * @default primary
  */
  @Input() alibType = 'primary'
}
```

## @type

- 类型：`string`
- 默认：`null`

属性的类型会优先从 TypeScript 类型定义中读取，也可通过 `@type` 手动指定。

```ts
export class AlibButtonComponent {
  /**
  * Button Type
  * @type 'primary' | 'success'
  */
  @Input() alibType = 'primary'
}
```

## @param

- 类型：`string`
- 默认：`null`

函数或方法的参数描述，格式为 `@param {类型} 参数名 描述`。

```ts
@Injectable({
    providedIn: 'root'
})
export class DialogService {
    /**
     * Open a dialog
     * @param {string} param1 param1 desc
     * @param {number} param2 param2 desc
     * @returns DialogRef
     */
    open(param1: string, param2: number): DialogRef {}
}
```
