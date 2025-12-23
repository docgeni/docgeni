import { Component, OnInit, OnDestroy, HostBinding, NgModuleFactory, Type, ElementRef, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService, GlobalContext } from '../../services/public-api';

@Component({
    selector: 'dg-channel',
    templateUrl: './channel.component.html',
    standalone: false,
})
export class ChannelComponent implements OnInit, OnDestroy {
    @HostBinding(`class.dg-layout`) isLayout = true;
    @HostBinding(`class.dg-scroll-container`) isScrollContainer = true;

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;
    private route = inject(ActivatedRoute);
    public navigationService = inject(NavigationService);
    public global = inject(GlobalContext);

    constructor() {}

    ngOnInit(): void {
        const path = this.route.snapshot.routeConfig?.path!;
        this.navigationService.selectChannelByPath(path);
    }

    ngOnDestroy() {
        this.navigationService.clearChannel();
    }
}

@Component({
    selector: 'dg-channel-home',
    template: ``,
    standalone: false,
})
export class ChannelHomeComponent implements OnInit {
    constructor(
        private router: Router,
        public navigationService: NavigationService,
        public global: GlobalContext,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        const firstDocItem = this.navigationService.getChannelFirstDocItem();
        if (firstDocItem) {
            this.router.navigate(['./' + firstDocItem.path], { replaceUrl: true, relativeTo: this.route });
        }
    }
}
