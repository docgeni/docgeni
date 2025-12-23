import { NavigationService } from './../../services/navigation.service';
import { Component, HostBinding } from '@angular/core';
import { GlobalContext } from '../../services/public-api';

@Component({
    selector: 'dg-root-actual',
    templateUrl: './root.component.html',
    standalone: false,
    host: {
        class: 'dg-main dg-layout',
        '[class.dg-scroll-container]': "global.config.mode === 'lite'",
        '[class.dg-sidebar-show]': 'navigationService.showSidebar',
    },
})
export class ActualRootComponent {
    constructor(
        public global: GlobalContext,
        public navigationService: NavigationService,
    ) {}
}

@Component({
    selector: 'dg-root',
    template: '<router-outlet></router-outlet>',
    standalone: false,
})
export class RootComponent {
    constructor(
        public global: GlobalContext,
        public navigationService: NavigationService,
    ) {}
}
