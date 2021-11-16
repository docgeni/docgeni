import { Component, Directive, OnInit, Input, Output, EventEmitter } from '@angular/core';

export type ButtonType = 'primary' | 'info' | 'success';

/**
 * General Button Component description.
 */
@Component({
    selector: 'thy-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

    /**
     * Button Type
     */
    @Input() thyType: ButtonType = 'primary';

    constructor() { }

    ngOnInit(): void { }
}
