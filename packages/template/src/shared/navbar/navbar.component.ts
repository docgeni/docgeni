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

    locale: string;

    channels: ChannelItem[];

    constructor(public global: GlobalContext, public navigationService: NavigationService, private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {
        this.channels = this.navigationService.getChannels();
        this.locale = this.global.locale;
        this.elementRef.nativeElement.classList.add(this.global.config.theme);
    }

    toggleNavbar() {
        this.showNav = !this.showNav;
    }

    localeModelChange() {
        this.global.setLocale(this.locale);
        location.href = location.href;
    }
}
