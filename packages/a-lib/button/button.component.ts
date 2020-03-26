import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'alib-button,[alibButton]',
    template: '<ng-content></ng-content>'
})
export class AlibButtonComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
