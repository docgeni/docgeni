import { Component, OnInit, HostBinding, ElementRef } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';

@Component({
    selector: 'dg-locales-selector',
    templateUrl: './locales-selector.component.html'
})
export class LocalesSelectorComponent implements OnInit {
    @HostBinding('class.dg-locales-selector') isNavbar = true;

    locale: string;

    constructor(public global: GlobalContext, public navigationService: NavigationService, private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {
        this.locale = this.global.locale;
    }

    localeModelChange() {
        this.global.setLocale(this.locale);
        location.href = location.href;
    }
}
