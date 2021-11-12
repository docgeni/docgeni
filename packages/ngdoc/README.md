# @docgeni/ngdoc

> Angular Component/Directive/Pipe/Service doc generator

## Usage

```ts
const { NgDocParser } = require('@docgeni/ngdoc');
const docs = NgDocParser.parse('./button.component.ts');
```

Input: 
```ts
import { Component, Directive, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoadingComponent } from './loading.component';

export type ButtonSize = 'lg' | 'md' | 'sm';

/**
 * General Button Component description.
 *
 * @export
 * @class ButtonComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'thy-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

    private type = '';

    /**
     * Button Type
     */
    @Input('thyTypeAlias') thyType: 'primary' | 'info' | 'success' = 'primary';

     /**
     * Button Size
     */
    @Input() thySize: ButtonSize;

    /**
     * Loading Event
     */
    @Output() thyLoadingEvent = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void { }
}
```

Output:

```json
[
    {
        type: 'component',
        name: 'ButtonComponent',
        description: 'General Button Component description.\nFor Book',
        selector: 'thy-button',
        templateUrl: './button.component.html',
        template: null,
        styleUrls: ['./button.component.scss'],
        styles: null,
        exportAs: null,
        properties: [
            {
                kind: 'input',
                name: 'thyType',
                type: '"primary" | "info" | "success"',
                description: 'Button Type',
                options: ['primary', 'info', 'success'],
                jsDocTags: [],
                default: 'primary'
            },
            {
                kind: 'input',
                name: 'thySize',
                type: 'ButtonSize',
                description: 'Button Size',
                options: null,
                jsDocTags: [],
                default: null
            },
            {
                kind: 'output',
                name: 'thyLoadingEvent',
                type: 'EventEmitter<boolean>',
                description: 'Loading Event',
                options: null,
                jsDocTags: [],
                default: 'new EventEmitter<boolean>()'
            }
        ]
    }
]
```
