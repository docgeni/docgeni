import { Component, OnInit } from '@angular/core';
import { NavigationService, ChannelItem, ConfigService } from '../../services';

@Component({
    selector: 'doc-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    channels: ChannelItem[];

    constructor(public config: ConfigService, public navigationService: NavigationService) {}

    ngOnInit(): void {
        this.channels = this.navigationService.getChannels();
    }
}
