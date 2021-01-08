import {
    Component,
    OnInit,
    NgModuleFactory,
    Type,
    ElementRef,
    Injector,
    OnDestroy,
    HostBinding,
    ChangeDetectionStrategy,
    ViewChild
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalContext, NavigationService } from '../../services/public-api';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocItem, NavigationItem } from '../../interfaces/public-api';
import { PageTitleService } from '../../services/page-title.service';
import { TableOfContentsComponent } from '../../shared/toc/toc.component';

@Component({
    selector: 'dg-doc-viewer',
    templateUrl: './doc-viewer.component.html'
})
export class DocViewerComponent implements OnInit, OnDestroy {
    @HostBinding(`class.dg-doc-viewer`) isDocViewer = true;

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    docItem$: Observable<NavigationItem> = this.navigationService.docItem$.asObservable();

    @ViewChild('toc') tableOfContents: TableOfContentsComponent;

    private destroyed = new Subject();

    get channel() {
        return this.navigationService.channel;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private navigationService: NavigationService,
        private pageTitle: PageTitleService,
        private global: GlobalContext
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            // component doc
            if (id) {
                this.navigationService.selectDocItem(id);
            } else {
                // doc
                const path = this.route.snapshot.routeConfig.path;
                this.navigationService.selectDocItem(path);
            }
            if (this.navigationService.docItem) {
                this.pageTitle.title = '' + this.navigationService.docItem.title;
            } else {
                const firstDoc = this.navigationService.searchFirstDocItem();
                if (firstDoc) {
                    this.router.navigate(['./' + firstDoc.path], { relativeTo: this.route });
                }
            }
        });

        this.navigationService.docItem$.pipe(takeUntil(this.destroyed)).subscribe(() => {
            // 100ms timeout is used to allow the page to settle before moving focus for screen readers.
            // setTimeout(() => this.focusTarget.nativeElement.focus({preventScroll: true}), 100);
            if (this.tableOfContents) {
                this.tableOfContents.resetHeaders();
            }
        });
    }

    updateTableOfContents(sectionName: string, docViewerContent: HTMLElement, sectionIndex = 0) {
        if (this.tableOfContents) {
            this.tableOfContents.addHeaders(sectionName, docViewerContent, sectionIndex);
            this.tableOfContents.updateScrollPosition();
        }
    }

    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }
}

@Component({
    selector: 'doc-viewer-home',
    template: ''
})
export class DocViewerHomeComponent implements OnDestroy {
    destroy$ = new Subject();

    constructor(navigationService: NavigationService, route: ActivatedRoute, router: Router) {
        navigationService.docItem$.pipe(takeUntil(this.destroy$)).subscribe(docItem => {
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
                    router.navigate([redirectTo], { relativeTo: route, replaceUrl: true });
                }
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
