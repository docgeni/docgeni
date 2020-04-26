import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';

const EXAMPLES_OVERVIEW_PATH = `/assets/content/examples-overviews`;
  // TODO:: locales support
const LOCAL = 'zh-cn';
@Component({
    selector: 'doc-component-overview',
    templateUrl: './component-overview.component.html'
})
export class ComponentOverviewComponent implements OnInit {
    contentUrl: string;

    @HostBinding('class.dg-doc-content') contentClass = true;

    constructor(public componentViewer: ComponentViewerComponent) {}

    ngOnInit(): void {
        this.contentUrl = `${EXAMPLES_OVERVIEW_PATH}/${this.componentViewer.docItem.importSpecifier}/${LOCAL}.html`;
    }
}
