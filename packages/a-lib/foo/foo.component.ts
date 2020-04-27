import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'alib-foo',
    template: `<ng-content></ng-content>
    `
})
export class AlibFooComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
