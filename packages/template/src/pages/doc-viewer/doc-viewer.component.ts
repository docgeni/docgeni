import { Component, effect, inject, NgModuleFactory, OnInit, signal, Type, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleService } from '../../services/page-title.service';
import { NavigationService } from '../../services/public-api';
import { TocService } from '../../services/toc.service';
import { TableOfContentsComponent } from '../../shared/toc/toc.component';
import { ComponentViewerComponent } from '../component-viewer/component-viewer.component';
import { DocHeaderComponent } from '../../shared/doc-header/doc-header.component';
import { ContentViewerComponent } from '../../shared/content-viewer/content-viewer.component';
import { DocPagesLinksComponent } from '../../shared/doc-pages-links/doc-pages-links.component';
import { DocMetaComponent } from '../../shared/doc-meta/doc-meta.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AssetsContentPathPipe } from '../../shared/pipes/assets-content-path.pipe';
import { IsComponentDocPipe } from '../../shared/pipes/nav.pipe';

@Component({
    selector: 'dg-doc-viewer',
    templateUrl: './doc-viewer.component.html',
    host: {
        '[class.dg-doc-viewer]': 'true',
        '[class.dg-doc-viewer--single]': 'isSingle()',
        '[class.dg-doc-viewer--toc]': 'hasContentToc()',
    },
    imports: [
        ComponentViewerComponent,
        DocHeaderComponent,
        ContentViewerComponent,
        DocPagesLinksComponent,
        DocMetaComponent,
        TableOfContentsComponent,
        FooterComponent,
        AssetsContentPathPipe,
        IsComponentDocPipe,
    ],
})
export class DocViewerComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    protected navigationService = inject(NavigationService);
    private pageTitle = inject(PageTitleService);
    private tocService = inject(TocService);

    // 独立展示的页面，不属于任何频道
    readonly isSingle = signal(false);

    readonly hasContentToc = signal(false);

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    readonly docItem = this.navigationService.docItem;

    readonly docPages = this.navigationService.docPages;

    @ViewChild('toc') tableOfContents!: TableOfContentsComponent;

    constructor() {
        effect(() => {
            const docItem = this.navigationService.docItem();
            const links = this.tocService.links();
            this.hasContentToc.set(docItem?.toc === 'content' && (links?.length ?? 0) > 0);
        });
    }

    ngOnInit(): void {
        if (this.route.snapshot.data) {
            this.isSingle.set(this.route.snapshot.data['single']);
        }
        this.route.paramMap.subscribe((params) => {
            const id = params.get('id');
            // component doc
            if (id) {
                const channel = this.navigationService.channel();
                const docPath = channel?.path ? `${channel.path}/${id}` : id;
                this.navigationService.selectDocItem(docPath);
                this.navigationService.resetShowSidebar();
            } else {
                // doc
                const path = this.route.snapshot.routeConfig?.path;
                this.navigationService.selectDocItem(path!);
            }
            const docItem = this.navigationService.docItem();
            if (docItem) {
                this.pageTitle.title = '' + docItem.title;
            } else {
                const firstDoc = this.navigationService.searchFirstDocItem();
                if (firstDoc) {
                    this.router.navigate(['./' + firstDoc.path], { relativeTo: this.route });
                }
            }
        });
    }

    close() {
        if (this.navigationService.showSidebar()) {
            this.navigationService.toggleSidebar();
        }
    }
}

@Component({
    selector: 'doc-viewer-home',
    template: '',
})
export class DocViewerHomeComponent {
    private navigationService = inject(NavigationService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    constructor() {
        effect(() => {
            const docItem = this.navigationService.docItem();
            if (docItem) {
                let redirectTo = './empty';
                if (docItem.overview) {
                    redirectTo = './overview';
                } else if (docItem.examples && docItem.examples.length > 0) {
                    redirectTo = './examples';
                } else if (docItem.api) {
                    redirectTo = './api';
                }
                if (redirectTo) {
                    this.router.navigate([redirectTo], { relativeTo: this.route, replaceUrl: true });
                }
            }
        });
    }
}
