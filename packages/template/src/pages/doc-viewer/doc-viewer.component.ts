import {
    Component,
    OnInit,
    HostBinding,
    ɵNgModuleFactory,
    NgModuleFactory,
    Type,
    ɵrenderComponent,
    ElementRef,
    Injector
} from '@angular/core';
import * as core from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NavigationService, DocItem } from '../../services';

@Component({
    selector: 'doc-viewer',
    templateUrl: './doc-viewer.component.html',
    styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit {
    // @HostBinding(`class.layout`) isLayout = true;

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    docItem: DocItem;

    constructor(
        private http: HttpClient,
        private elementRef: ElementRef<HTMLElement>,
        private injector: Injector,
        private route: ActivatedRoute,
        private navigationService: NavigationService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const doc = params.get('doc');
            const docItem = this.navigationService.getDocItem(doc);
            this.docItem = docItem;
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
