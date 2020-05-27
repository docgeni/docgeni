import {
    Component,
    OnInit,
    NgModuleFactory,
    Type,
    ElementRef,
    Injector,
    OnDestroy
} from '@angular/core';
import * as core from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocItem, NavigationItem } from '../../interfaces';

@Component({
    selector: 'dg-doc-viewer',
    templateUrl: './doc-viewer.component.html'
})
export class DocViewerComponent implements OnInit {
    // @HostBinding(`class.layout`) isLayout = true;

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
        private http: HttpClient,
        private elementRef: ElementRef<HTMLElement>,
        private injector: Injector,
        private route: ActivatedRoute,
        private router: Router,
        private navigationService: NavigationService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            this.navigationService.selectDocItem(id);
            if (this.isComponentDoc && !this.navigationService.docItem) {
                const firstDoc = this.navigationService.getChannelFirstDocItem();
                if (!id) {
                    this.router.navigate([`./${firstDoc.path}`], { relativeTo: this.route });
                }
            }
        });
        // const script = document.createElement('script');
        // script.type = 'text/javascript';
        // script.src = '/assets/bundles/first-lib.umd.js';
        // document.getElementsByTagName('head')[0].appendChild(script);
        // window['ng'] = window['ng'] || {};
        // window['ng'].core = core;
        // script.onload = () => {
        //     const module = window['first-lib'];
        //     // const d = ɵrenderComponent(module.FirstLibComponent, {
        //     //     injector: this.injector,
        //     //     host: this.elementRef.nativeElement
        //     // });
        //     this.exampleModuleFactory = new ɵNgModuleFactory(module.FirstLibModule);
        //     this.exampleComponentType = module.FirstLibComponent;
        // };

        // import('../../../assets/fesm2015/first-lib.js').then(module => {
        //     // const d = ɵrenderComponent(module.FirstLibComponent, {
        //     //     injector: this.injector,
        //     //     host: this.elementRef.nativeElement
        //     // });
        //     this.exampleModuleFactory = new ɵNgModuleFactory(module.FirstLibModule);
        //     this.exampleComponentType = module.FirstLibComponent;
        // });
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
                router.navigate(['../overview'], { relativeTo: route });
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
