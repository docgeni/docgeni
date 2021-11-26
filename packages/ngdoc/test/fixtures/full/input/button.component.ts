import { Component, Directive, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoadingComponent } from './loading.component';

export type ButtonSize = 'lg' | 'md' | 'sm';

/**
 * General Button Component description.
 * @export
 * @class ButtonComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'thy-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    exportAs: 'thyButton'
})
export class ButtonComponent implements OnInit {

    private type = '';

    /**
     * Button Type
     */
    @Input('thyTypeAlias') thyType: 'primary' | 'info' | 'success' = 'primary';

     /**
     * Button Size
     */
    @Input() thySize: ButtonSize;

    /**
     * Loading Event
     */
    @Output() thyLoadingEvent = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void { }
}



/**
 * General Button Icon Directive description.
 * @export
 * @class ButtonIconComponent
 * @implements {OnInit}
 */
 @Directive({
    selector: '[thyButtonIcon]',
})
export class ButtonIconComponent implements OnInit {}
