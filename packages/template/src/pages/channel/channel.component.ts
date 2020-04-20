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
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../services';

@Component({
    selector: 'doc-channel',
    templateUrl: './channel.component.html',
    styleUrls: ['./channel.component.scss']
})
export class DocChannelComponent implements OnInit {
    @HostBinding(`class.docgeni-layout`) isLayout = true;

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    constructor(
        private http: HttpClient,
        private elementRef: ElementRef<HTMLElement>,
        private route: ActivatedRoute,
        public navigationService: NavigationService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            const path = params.get('channel');
            this.navigationService.selectChannelByPath(path);
        });
    }
}
