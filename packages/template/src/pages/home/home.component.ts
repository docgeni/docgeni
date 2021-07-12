import { Component, OnInit, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { GlobalContext, NavigationService } from '../../services/public-api';
import { Router } from '@angular/router';
import { PageTitleService } from '../../services/page-title.service';
import { HomeDocMeta } from '@docgeni/template/interfaces';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'dg-home',
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
    @HostBinding(`class.dg-home`) isHome = true;
    hasHome = false;
    extraContent: SafeHtml;
    constructor(
        public global: GlobalContext,
        router: Router,
        navigationService: NavigationService,
        pageTitle: PageTitleService,
        private domeSan: DomSanitizer
    ) {
        if (!global.homeMeta) {
            if (global.config.mode === 'full') {
                const channels = navigationService.getChannels();
                if (channels && channels[0].path && !channels[0].isExternal) {
                    router.navigateByUrl(channels[0].path, {
                        replaceUrl: true
                    });
                }
            } else {
                const docItem = navigationService.searchFirstDocItem();
                if (docItem) {
                    router.navigateByUrl(docItem.path, {
                        replaceUrl: true
                    });
                }
            }
            return;
        }
        pageTitle.title = 'Home';
        this.hasHome = true;
        this.extraContent = this.domeSan.bypassSecurityTrustHtml(global.homeMeta.extra);
    }

    ngOnInit(): void {}
    btnClass(item: HomeDocMeta['hero']['actions'][0]) {
        return ['dg-btn-lg', `dg-btn-${item.btnType || 'primary'}`, `dg-btn-${item.btnShape || 'round'}`];
    }
}
