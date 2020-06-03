import { Component, Input } from '@angular/core';

/**
 * This is test component
 */
@Component({
    selector: 'app-test',
    template: ''
})
export class TestComponent {
    /** Type 表示  */
    @Input() type: string;

    constructor() {}

    /** Say */
    private say() {
        return 'say';
    }
}
