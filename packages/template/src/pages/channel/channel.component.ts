import { Component, OnInit, HostBinding, NgModuleFactory, Type, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../services/public-api';

@Component({
    selector: 'dg-channel',
    templateUrl: './channel.component.html'
})
export class ChannelComponent implements OnInit {
    @HostBinding(`class.dg-layout`) isLayout = true;

    @HostBinding(`class.dg-sidebar-show`) get showSidebar() {
        return this.navigationService.showSidebar;
    }

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
