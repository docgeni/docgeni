import { Component, OnInit, OnDestroy, Input, HostBinding } from '@angular/core';
import { DocItem, ComponentDocItem } from '../../interfaces';

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
