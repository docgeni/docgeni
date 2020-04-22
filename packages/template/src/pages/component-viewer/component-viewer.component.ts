import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DocItem, ComponentDocItem } from '../../interfaces';

@Component({
    selector: 'doc-component-viewer',
    templateUrl: './component-viewer.component.html'
})
export class DocComponentViewerComponent implements OnInit {
    @Input() docItem: ComponentDocItem;

    constructor() {}

    ngOnInit(): void {}
}
