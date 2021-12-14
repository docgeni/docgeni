import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'alib-layout',
    template: `
        <ng-content></ng-content>
    `
})
export class AlibLayoutComponent implements OnInit {
    @HostBinding(`class.alib-layout`) isLayout = true;

    /**
     * Direction `vertical`
     */
    @Input() thyDirection: 'vertical' | 'horizontal';

    constructor() {}

    ngOnInit(): void {}
}
