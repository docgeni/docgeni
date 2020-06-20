import {
    Component,
    OnInit,
    NgModuleFactory,
    Type,
    ElementRef,
    Injector,
    OnDestroy,
    HostBinding,
    ChangeDetectionStrategy
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocItem, NavigationItem } from '../../interfaces';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'dg-doc-viewer',
    templateUrl: './doc-viewer.component.html'
})
export class DocViewerComponent implements OnInit {
    @HostBinding(`class.dg-doc-viewer`) isDocViewer = true;

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    docItem$: Observable<DocItem | NavigationItem> = this.navigationService.docItem$.asObservable();

    get channel() {
        return this.navigationService.channel;
    }

    get isComponentDoc() {
        return this.navigationService.channel && this.navigationService.channel.lib;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private navigationService: NavigationService,
        private pageTitle: PageTitleService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            this.navigationService.selectDocItem(id);
            if (!this.navigationService.docItem) {
                const firstDoc = this.navigationService.getChannelFirstDocItem();
                if (!id) {
                    this.router.navigate([`./${firstDoc.path}`], { relativeTo: this.route });
                }
            } else {
                this.pageTitle.title = `${this.navigationService.docItem.title}`;
            }
        });
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
                let redirectTo = '';
                if (docItem.overview) {
                    redirectTo = '../overview';
                } else if (docItem.examples && docItem.examples.length > 0) {
                    redirectTo = '../examples';
                } else if (docItem.api) {
                    redirectTo = '../api';
                }
                if (redirectTo) {
                    router.navigate([redirectTo], { relativeTo: route });
                }
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
