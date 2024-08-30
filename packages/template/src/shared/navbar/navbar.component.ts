import { Component, OnInit, HostBinding, ElementRef } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';
import { ChannelItem } from '../../interfaces/public-api';

@Component({
    selector: 'dg-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
    @HostBinding('class.dg-navbar') isNavbar = true;

    @HostBinding('class.show') showNav = false;

    theme!: string;

    themeIcon = 'lightTheme';

    channels!: ChannelItem[];

    constructor(public global: GlobalContext, public navigationService: NavigationService, private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {
        this.channels = this.navigationService.getChannels();
        this.elementRef.nativeElement.classList.add(this.global.config.theme!);

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
}
