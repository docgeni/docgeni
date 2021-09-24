import { ActivatedRoute, Router, Routes } from '@angular/router';
import { NavigationService } from './../../services/navigation.service';
import { Component, HostBinding } from '@angular/core';
import { GlobalContext } from '../../services/public-api';
@Component({
    selector: 'dg-root-actual',
    templateUrl: './root.component.html'
})
export class ActualRootComponent {
    @HostBinding(`class.dg-main`) isMain = true;

    @HostBinding(`class.dg-layout`) isLayout = true;

    @HostBinding(`class.dg-scroll-container`) isScrollContainer = this.global.config.mode === 'lite';

    @HostBinding(`class.dg-sidebar-show`) get showSidebar() {
        return this.navigationService.showSidebar;
    }

    constructor(public global: GlobalContext, public navigationService: NavigationService, route: ActivatedRoute) {
        // const locale = route.snapshot.paramMap.get('locale');
        // if (locale && locale !== global.locale) {
        //     global.setLocale(locale);
        //     Promise.resolve(() => {
        //         window.location.href = window.location.host + window.location.pathname;
        //     });
        // }
    }
}

@Component({
    selector: 'dg-root',
    template: '<router-outlet></router-outlet>'
})
export class RootComponent {
    constructor(public global: GlobalContext, public navigationService: NavigationService) {}
}
