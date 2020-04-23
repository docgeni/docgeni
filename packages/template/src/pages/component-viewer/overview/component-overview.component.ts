import { Component, OnInit } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';

@Component({
    selector: 'doc-component-overview',
    templateUrl: './component-overview.component.html'
})
export class ComponentOverviewComponent implements OnInit {
    constructor(public componentViewer: ComponentViewerComponent) {}

    ngOnInit(): void {}
}
