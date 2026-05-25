import { NavigationService } from './../../services/navigation.service';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalContext } from '../../services/public-api';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { IsModeLitePipe, IsModeFullPipe } from '../../shared/pipes/mode.pipe';

@Component({
    selector: 'dg-root-actual',
    templateUrl: './root.component.html',
    host: {
        class: 'dg-main dg-layout',
        '[class.dg-scroll-container]': "global.config.mode === 'lite'",
        '[class.dg-sidebar-show]': 'navigationService.showSidebar',
    },
    imports: [NavbarComponent, SidebarComponent, RouterOutlet, IsModeLitePipe, IsModeFullPipe],
})
export class ActualRootComponent {
    public global = inject(GlobalContext);
    public navigationService = inject(NavigationService);

    constructor() {}
}

@Component({
    selector: 'dg-root',
    template: '<router-outlet></router-outlet>',
    standalone: true,
    imports: [RouterOutlet],
})
export class RootComponent {
    public global = inject(GlobalContext);
    public navigationService = inject(NavigationService);

    constructor() {}
}
