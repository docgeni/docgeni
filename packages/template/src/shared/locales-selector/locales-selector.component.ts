import { DOCUMENT } from '@angular/common';
import { Component, OnInit, HostBinding, ElementRef, Inject } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';

@Component({
    selector: 'dg-locales-selector',
    templateUrl: './locales-selector.component.html'
})
export class LocalesSelectorComponent implements OnInit {
    @HostBinding('class.dg-locales-selector') isNavbar = true;

    locale: string;

    constructor(public global: GlobalContext, public navigationService: NavigationService, @Inject(DOCUMENT) private document: any) {}

    ngOnInit(): void {
        this.locale = this.global.locale;
    }

    localeModelChange() {
        const isDefaultLocale = this.locale === this.global.config.defaultLocale;
        const localKeyFromUrl = this.global.getLocalKeyFromUrl();
        if (isDefaultLocale) {
            this.global.setLocale(this.locale);
        }
        if (localKeyFromUrl) {
            location.href =
                document.location.origin +
                document.location.pathname.replace('/' + localKeyFromUrl, isDefaultLocale ? '' : `/${this.locale}`);
        } else {
            location.href = isDefaultLocale
                ? document.location.origin + document.location.pathname
                : document.location.origin + `/${this.locale}` + location.pathname;
        }
    }
}
