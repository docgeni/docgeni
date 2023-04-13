import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Foo Component
 */
@Component({
    selector: 'alib-foo',
    template: `
        <ng-content></ng-content>
    `,
    standalone: true
})
export class AlibFooComponent implements OnInit {
    /**
     * Type is foo
     * @type string
     */
    @Input() alibType!: 'primary' | 'secondary';

    /**
     * Close event when foo close
     * @type string
     */
    @Output() alibClose = new EventEmitter<string>();

    constructor() {}

    ngOnInit(): void {
        this.alibClose.emit('hello');
    }
}
