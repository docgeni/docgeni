import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'alib-button',
    templateUrl: './button.component.html',
    styles: []
})
export class ButtonComponent implements OnInit {
    @Input() title = 'hello world';

    constructor() {}

    ngOnInit(): void {}
}
