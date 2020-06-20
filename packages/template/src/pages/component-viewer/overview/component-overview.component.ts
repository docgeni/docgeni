import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { GlobalContext } from '../../../services';

const OVERVIEWS_PATH = `/assets/content/overviews`;

@Component({
    selector: 'dg-component-overview',
    templateUrl: './component-overview.component.html'
})
export class ComponentOverviewComponent implements OnInit {
    contentUrl: string;

    @HostBinding('class.dg-component-overview') contentClass = true;

    constructor(public componentViewer: ComponentViewerComponent, private global: GlobalContext) {}

    ngOnInit(): void {
        this.contentUrl = `${OVERVIEWS_PATH}/${this.componentViewer.docItem.importSpecifier}/${this.global.locale}.html`;
    }
}
