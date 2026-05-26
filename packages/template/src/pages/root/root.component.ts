import { NavigationService } from './../../services/navigation.service';
import { Component, computed, effect, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, merge, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GlobalContext } from '../../services/public-api';
import { NavigationItem } from '../../interfaces';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { IsModeLitePipe, IsModeFullPipe } from '../../shared/pipes/mode.pipe';

@Component({
    selector: 'dg-root-actual',
    templateUrl: './root.component.html',
    host: {
        class: 'dg-main dg-layout',
        '[class.dg-scroll-container]': "global.config.mode === 'lite' || !!navigationService.channel()",
        '[class.dg-sidebar-show]': 'navigationService.showSidebar()',
    },
    imports: [NavbarComponent, SidebarComponent, RouterOutlet, IsModeFullPipe],
})
export class ActualRootComponent {
    public global = inject(GlobalContext);
    public navigationService = inject(NavigationService);
    private router = inject(Router);

    private url = toSignal(
        merge(
            of(this.router.url),
            this.router.events.pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                map(() => this.router.url),
            ),
        ),
    );

    sidebarMenus = computed(() => {
        if (this.global.config.mode === 'lite') {
            return this.navigationService.navs();
        }
        const items = this.navigationService.channel()?.items;
        return items?.length ? (items as NavigationItem[]) : null;
    });

    constructor() {
        effect(() => {
            if (this.global.config.mode !== 'full') {
                return;
            }
            const channelPath = this.getChannelPathFromUrl(this.url() ?? this.router.url);
            if (channelPath) {
                this.navigationService.selectChannelByPath(channelPath);
            } else {
                this.navigationService.clearChannel();
            }
        });
    }

    private getChannelPathFromUrl(url: string): string | null {
        const segments = url.split('?')[0].split('#')[0].split('/').filter(Boolean);
        const localeKeys = this.global.config.locales?.map((locale) => locale.key) ?? [];
        if (segments.length && localeKeys.includes(segments[0])) {
            segments.shift();
        }
        if (!segments.length) {
            return null;
        }
        const channel = this.navigationService.getChannel(segments[0]);
        if (channel && !channel.isExternal && channel.path) {
            return segments[0];
        }
        return null;
    }
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
