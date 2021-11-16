import { Component, Directive, OnInit, Input, Output, EventEmitter } from '@angular/core';

export enum ButtonType {
    primary = 'primary-value',
    info = 'info-value',
    success = 'success-value'
};

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
    @Input() thyType: ButtonType = ButtonType.info;

    constructor() { }

    ngOnInit(): void { }
}
