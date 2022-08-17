import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { ComponentDocItem } from '../../interfaces/public-api';

@Component({
    selector: 'dg-component-viewer',
    templateUrl: './component-viewer.component.html'
})
export class ComponentViewerComponent implements OnInit {
    @HostBinding(`class.dg-component-viewer`) isDocViewer = true;

    @Input() docItem: ComponentDocItem;

    constructor() {}

    ngOnInit(): void {}
}

@Component({
    selector: 'dg-component-empty',
    template: `
        <p>Current component has not been documented.</p>
    `
})
export class ComponentEmptyComponent implements OnInit {
    @HostBinding(`class.dg-component-empty`) isDocEmpty = true;

    constructor() {}

    ngOnInit(): void {}
}
