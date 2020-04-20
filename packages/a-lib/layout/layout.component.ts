import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'alib-layout',
    template: `
        <ng-content></ng-content>
    `
})
export class AlibLayoutComponent implements OnInit {
    @HostBinding(`class.alib-layout`) isLayout = true;

    constructor() {}

    ngOnInit(): void {}
}
