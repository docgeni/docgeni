import { Component, OnInit, HostBinding } from '@angular/core';
import { GlobalContext, NavigationService } from '../../services';
import { Router } from '@angular/router';

@Component({
    selector: 'dg-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    @HostBinding(`class.dg-home`) isHome = true;

    constructor(public global: GlobalContext, router: Router, navigationService: NavigationService) {
        if (!global.config.homeMeta) {
            const channels = navigationService.getChannels();
            if (channels && channels[0].path && !channels[0].isExternal) {
                router.navigateByUrl(channels[0].path);
            }
        }
    }

    ngOnInit(): void {}
}
