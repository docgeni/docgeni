import { Component, OnInit, HostBinding, ViewChild, inject } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { GlobalContext } from '../../../services/public-api';
import { TableOfContentsComponent } from '../../../shared/toc/toc.component';

@Component({
    selector: 'dg-component-overview',
    templateUrl: './component-overview.component.html',
    host: {
        class: 'dg-component-overview',
    },
    standalone: false,
})
export class ComponentOverviewComponent implements OnInit {
    contentUrl!: string;

    @ViewChild('toc') tableOfContents!: TableOfContentsComponent;

    protected componentViewer = inject(ComponentViewerComponent);

    private global: GlobalContext = inject(GlobalContext);

    constructor() {}

    ngOnInit(): void {
        this.contentUrl = this.global.getAssetsContentPath(
            `overviews/${this.componentViewer.docItem().importSpecifier}/${this.global.locale}.html`,
        );
    }
}
