import { Location } from '@angular/common';
import { Component, OnInit, HostBinding, ElementRef, Inject } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';

@Component({
    selector: 'dg-locales-selector',
    templateUrl: './locales-selector.component.html'
})
export class LocalesSelectorComponent implements OnInit {
    @HostBinding('class.dg-locales-selector') isNavbar = true;

    locale!: string;

    constructor(public global: GlobalContext, public navigationService: NavigationService, private location: Location) {}

    ngOnInit(): void {
        this.locale = this.global.locale;
    }

    localeModelChange() {
        const isDefaultLocale = this.locale === this.global.config.defaultLocale;
        const localKeyFromUrl = this.global.getLocalKeyFromUrl();
        if (isDefaultLocale) {
            this.global.setLocale(this.locale);
        }
        const currentPath = this.location.path();
        if (localKeyFromUrl) {
            this.location.go(currentPath.replace('/' + localKeyFromUrl, isDefaultLocale ? '' : `/${this.locale}`));
        } else {
            this.location.go(isDefaultLocale ? currentPath : `/${this.locale}${currentPath}`);
        }
        // 强制刷新
        location.href = location.href;
    }
}
