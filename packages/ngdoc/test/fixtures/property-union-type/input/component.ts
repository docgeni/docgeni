import { Component, Directive, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
    @Input() thyType: 'primary' | 'info' | 'success' = 'primary';

    constructor() { }

    ngOnInit(): void { }
}
