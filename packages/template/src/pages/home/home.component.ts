import { Component, OnInit, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { GlobalContext, NavigationService } from '../../services/public-api';
import { Router } from '@angular/router';
import { PageTitleService } from '../../services/page-title.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
    selector: 'dg-home',
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'dg-home',
    },
    standalone: false,
})
export class HomeComponent implements OnInit {
    hasHome = false;

    get bannerImgSrc() {
        const banner = this.global.homeMeta.hero.banner;

        if (banner) {
            if (typeof banner === 'string') {
                return banner;
            }

            if (Array.isArray(banner)) {
                if (banner.length === 1) {
                    return banner[0];
                }

                if (banner.length === 2) {
                    if (this.global.isDarkTheme()) {
                        return banner[1];
                    } else {
                        return banner[0];
                    }
                }

                return false;
            }

            return false;
        }

        return false;
    }

    constructor(
        public global: GlobalContext,
        router: Router,
        navigationService: NavigationService,
        pageTitle: PageTitleService,
    ) {
        if (!global.homeMeta) {
            if (global.config.mode === 'full') {
                const channels = navigationService.getChannels();
                if (channels && channels[0].path && !channels[0].isExternal) {
                    router.navigateByUrl(channels[0].path, {
                        replaceUrl: true,
                    });
                }
            } else {
                const docItem = navigationService.searchFirstDocItem();
                if (docItem) {
                    router.navigateByUrl(docItem.path, {
                        replaceUrl: true,
                    });
                }
            }
            return;
        }
        pageTitle.title = new TranslatePipe(global).transform('HOME');
        this.hasHome = true;
    }

    ngOnInit(): void {}
}
