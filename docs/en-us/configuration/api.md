---
title: API Comment
path: 'api'
order: 50
toc: menu
---

Generate API docs by adding comments to classes, interfaces, properties and methods for Component/Directive/Service/Class/Interface.

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

- Type: `string`
- Default: `{ClassName}`

The name of the Component/Directive, which defaults to the class name.

## @description

- Type: `string`
- Default: ``

Description. If there is a `@description` tag, it is main, otherwise the default comment content will be used as the description.

```ts
/**
 * General Button Component description.
 * @name alib-button
 * @description This is description
 * @order 1
 */
```

## @order

- Type: `number`
- Default: `null`

Sorting of API docs.

## @private

- Type: `boolean`
- Default: `false`
- Alias: `internal`

The default API document generation includes：
- All Component/Directive/Service
- Properties of @Input and @Output in Component/Directive
- Public methods in Component/Directive/Service

以上的组件/指令/服务/参数/函数是内部的，不需要生成 API 文档，需要添加`@private`或者`@internal`即可。

If the above Component/Directive/Service/Property/Methods are internal and do not need to generate API documents, you need to add `@private` or `@internal`.

```ts
/**
 * General Button Component description.
 * @private 
 */
```

## @public

- Type: `boolean`
- Default: `false`
- Alias: `publicApi`

By default, all Classes and Interfaces will not generate API documents. If a certain class and interface needs to generate API documents, it is necessary to add `@public` or `@publicApi`.


```ts
/**
 * Some Class description.
 * @public 
 */
export class SomeClass {}
```

## @default

- Type: `string`
- Default: `null`

The default value of the property will automatically read the TypeScript assignment statement and be manually set by `@default`.


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

- Type: `string`
- Default: `null`

The type of the attribute will automatically read the TypeScript type definition and manually set the default value through `@type`.
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

- Type: `string`
- Default: `null`

The description of parameter for methods

```ts
@Injectable({
    providedIn: 'root'
})
export class DialogService {
    /**
     * Open a dialog
     * @param {string} pram1 pram1 desc
     * @param {number} pram2 pram2 desc
     * @returns DialogRef
     */
    open(pram1: string, pram2: number): DialogRef {}
}
```
