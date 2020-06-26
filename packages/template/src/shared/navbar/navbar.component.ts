import { Component, OnInit, HostBinding } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services';
import { ChannelItem } from '../../interfaces';
import { Router } from '@angular/router';

@Component({
    selector: 'dg-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
    @HostBinding('class.dg-navbar') isNavbar = true;

    @HostBinding('class.show') showNav = false;

    locale: string;

    channels: ChannelItem[];

    constructor(public global: GlobalContext, public navigationService: NavigationService) {}

    ngOnInit(): void {
        this.channels = this.navigationService.getChannels();
        this.locale = this.global.locale;
    }

    toggleNavbar() {
        this.showNav = !this.showNav;
    }

    localeModelChange() {
        this.global.setLocale(this.locale);
        location.href = location.href;
    }
}
