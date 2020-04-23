import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DocItem, ComponentDocItem } from '../../interfaces';

@Component({
    selector: 'dg-component-viewer',
    templateUrl: './component-viewer.component.html'
})
export class ComponentViewerComponent implements OnInit {
    @Input() docItem: ComponentDocItem;

    constructor() {}

    ngOnInit(): void {}
}
