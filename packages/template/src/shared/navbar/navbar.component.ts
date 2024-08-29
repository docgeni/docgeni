import { Component, OnInit, HostBinding, ElementRef } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';
import { ChannelItem } from '../../interfaces/public-api';
import { Location } from '@angular/common';

@Component({
    selector: 'dg-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
    @HostBinding('class.dg-navbar') isNavbar = true;

    @HostBinding('class.show') showNav = false;

    theme!: string;

    themeIcon = 'lightTheme';

    // 'zh-cn' | 'en-us'
    locale!: string;

    channels!: ChannelItem[];

    constructor(
        public global: GlobalContext,
        public navigationService: NavigationService,
        private elementRef: ElementRef<HTMLElement>,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.channels = this.navigationService.getChannels();
        this.elementRef.nativeElement.classList.add(this.global.config.theme!);

        this.locale = this.global.locale;

        this.theme = window.localStorage.getItem('docgeni-theme') as string;
        this.setTheme();
    }

    toggleNavbar() {
        this.showNav = !this.showNav;
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.setTheme();
    }

    setTheme() {
        if (this.theme === 'dark') {
            document.documentElement.setAttribute('theme', 'dark');
            window.localStorage.setItem('docgeni-theme', 'dark');
            this.themeIcon = 'darkTheme';
        } else {
            document.documentElement.removeAttribute('theme');
            window.localStorage.setItem('docgeni-theme', 'light');
            this.themeIcon = 'lightTheme';
        }
    }

    toggleLocale() {
        this.locale = this.locale === 'zh-cn' ? 'en-us' : 'zh-cn';
        const isDefaultLocale = this.locale === this.global.config.defaultLocale;
        const localKeyFromUrl = this.global.getLocalKeyFromUrl();
        if (isDefaultLocale) {
            this.global.setLocale(this.locale);
        }
        const currentPath = this.location.path();
        if (localKeyFromUrl) {
            this.location.go(currentPath.replace('/' + localKeyFromUrl, isDefaultLocale ? '' : `/${this.locale}`));
        } else {
            this.location.go(isDefaultLocale ? currentPath : `/${this.locale}${currentPath}`);
        }
        // 强制刷新
        location.href = location.href;
    }
}
