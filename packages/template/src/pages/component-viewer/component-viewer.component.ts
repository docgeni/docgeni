import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DocItem } from '../../interfaces';

@Component({
    selector: 'doc-component-viewer',
    templateUrl: './component-viewer.component.html'
})
export class DocComponentViewerComponent implements OnInit {
    @Input() docItem: DocItem;

    constructor() {}

    ngOnInit(): void {}
}
