import { Component, OnInit, HostBinding, input } from '@angular/core';
import { ComponentDocItem } from '../../interfaces/public-api';

@Component({
    selector: 'dg-component-viewer',
    templateUrl: './component-viewer.component.html',
    host: {
        class: 'dg-component-viewer',
    },
    standalone: false,
})
export class ComponentViewerComponent implements OnInit {
    readonly docItem = input.required<ComponentDocItem>();

    constructor() {}

    ngOnInit(): void {}
}

@Component({
    selector: 'dg-component-empty',
    template: ` <p>Current component has not been documented.</p> `,
    host: {
        class: 'dg-component-empty',
    },
    standalone: false,
})
export class ComponentEmptyComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
