import { Component, OnInit, HostBinding, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Layout container component. it is required that all child components should be placed inside.
 * @name alibLayout
 */
@Component({
    selector: 'alib-layout, [alibLayout]',
    template: ` <ng-content></ng-content> `,
    exportAs: 'alibLayout',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class AlibLayoutComponent implements OnInit {
    @HostBinding(`class.alib-layout`) isLayout = true;

    /**
     * Direction of Layout, `vertical` and `horizontal`
     * @type string
     * @default horizontal
     */
    @Input() thyDirection: 'vertical' | 'horizontal' = 'vertical';

    /**
     * Layout changed
     */
    @Output() thyChanged = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}
}

/**
 * @name alibSidebar
 */
@Component({
    selector: 'alib-sidebar, [alibSidebar]',
    template: ` <ng-content></ng-content> `,
    exportAs: 'alibSidebar',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class AlibSidebarComponent implements OnInit {
    /**
     * Direction of Layout, `vertical` and `horizontal`
     * @type string
     * @default horizontal
     */
    @Input() thyDirection: 'vertical' | 'horizontal' = 'vertical';

    /**
     * Layout changed
     */
    @Output() thyChanged = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {}
}
