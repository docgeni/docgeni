import { Component, OnInit, HostBinding } from '@angular/core';
import { NavigationService, ConfigService } from '../../services';
import { ChannelItem } from '../../interfaces';

@Component({
    selector: 'dg-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
    @HostBinding('class.dg-navbar') isNavbar = true;

    channels: ChannelItem[];

    constructor(public config: ConfigService, public navigationService: NavigationService) {}

    ngOnInit(): void {
        this.channels = this.navigationService.getChannels();
    }
}
