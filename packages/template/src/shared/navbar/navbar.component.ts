import { Component, OnInit, HostBinding } from '@angular/core';
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
