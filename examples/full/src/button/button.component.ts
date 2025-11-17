import { Component, Input, OnInit } from '@angular/core';

/**
 * Button component
 * @name alib-button
 */
@Component({
    selector: 'alib-button',
    templateUrl: './button.component.html',
    styles: [],
    standalone: false,
})
export class ButtonComponent implements OnInit {
    /**
     * Button Type
     */
    @Input() title = 'hello world';

    constructor() {}

    ngOnInit(): void {}
}
