import { Component, OnInit, HostBinding, Input, ViewChild } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { GlobalContext } from '../../../services';
import { TableOfContentsComponent } from '../../../shared/toc/toc.component';

const OVERVIEWS_PATH = `/assets/content/overviews`;

@Component({
    selector: 'dg-component-overview',
    templateUrl: './component-overview.component.html'
})
export class ComponentOverviewComponent implements OnInit {
    contentUrl: string;

    @HostBinding('class.dg-component-overview') contentClass = true;

    @ViewChild('toc') tableOfContents: TableOfContentsComponent;

    constructor(public componentViewer: ComponentViewerComponent, private global: GlobalContext) {}

    ngOnInit(): void {
        this.contentUrl = `${OVERVIEWS_PATH}/${this.componentViewer.docItem.importSpecifier}/${this.global.locale}.html`;
    }

    updateTableOfContents(docViewerContent: HTMLElement, sectionIndex = 0) {
        if (this.tableOfContents) {
            this.tableOfContents.addHeaders(this.componentViewer.docItem.title, docViewerContent, sectionIndex);
            this.tableOfContents.updateScrollPosition();
        }
    }
}
