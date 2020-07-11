import { Component, OnInit, HostBinding } from '@angular/core';
import { GlobalContext, NavigationService } from '../../services/public-api';
import { Router } from '@angular/router';
import { PageTitleService } from '../../services/page-title.service';

@Component({
    selector: 'dg-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    @HostBinding(`class.dg-home`) isHome = true;

    constructor(public global: GlobalContext, router: Router, navigationService: NavigationService, pageTitle: PageTitleService) {
        if (!global.config.homeMeta) {
            const channels = navigationService.getChannels();
            if (channels && channels[0].path && !channels[0].isExternal) {
                router.navigateByUrl(channels[0].path, {
                    replaceUrl: true
                });
                return;
            }
        }
        pageTitle.title = 'Home';
    }

    ngOnInit(): void {}
}
