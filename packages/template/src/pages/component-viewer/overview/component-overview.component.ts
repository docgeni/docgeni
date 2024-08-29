import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { GlobalContext } from '../../../services/public-api';
import { TableOfContentsComponent } from '../../../shared/toc/toc.component';

@Component({
    selector: 'dg-component-overview',
    templateUrl: './component-overview.component.html'
})
export class ComponentOverviewComponent implements OnInit {
    contentUrl!: string;

    @HostBinding('class.dg-component-overview') contentClass = true;

    @ViewChild('toc') tableOfContents!: TableOfContentsComponent;

    constructor(public componentViewer: ComponentViewerComponent, private global: GlobalContext) {}

    ngOnInit(): void {
        this.contentUrl = this.global.getAssetsContentPath(
            `overviews/${this.componentViewer.docItem.importSpecifier}/${this.global.locale}.html`
        );
    }
}
