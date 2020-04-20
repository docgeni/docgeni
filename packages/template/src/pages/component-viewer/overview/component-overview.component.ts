import { Component, OnInit } from '@angular/core';
import { DocComponentViewerComponent } from '../component-viewer.component';

@Component({
    selector: 'doc-component-overview',
    templateUrl: './component-overview.component.html'
})
export class DocComponentOverviewComponent implements OnInit {
    constructor(public docComponentViewer: DocComponentViewerComponent) {}

    ngOnInit(): void {}
}
