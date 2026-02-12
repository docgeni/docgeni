import { Component, OnInit, HostBinding, ChangeDetectionStrategy, inject } from '@angular/core';
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
    public global = inject(GlobalContext);
    router = inject(Router);
    navigationService = inject(NavigationService);
    pageTitle = inject(PageTitleService);
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

    constructor() {
        if (!this.global.homeMeta) {
            if (this.global.config.mode === 'full') {
                const channels = this.navigationService.getChannels();
                if (channels && channels[0].path && !channels[0].isExternal) {
                    this.router.navigateByUrl(channels[0].path, {
                        replaceUrl: true,
                    });
                }
            } else {
                const docItem = this.navigationService.searchFirstDocItem();
                if (docItem) {
                    this.router.navigateByUrl(docItem.path, {
                        replaceUrl: true,
                    });
                }
            }
            return;
        }
        this.pageTitle.title = new TranslatePipe(this.global).transform('HOME');
        this.hasHome = true;
    }

    ngOnInit(): void {}
}
