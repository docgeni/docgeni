import { Component, OnInit, HostBinding, ElementRef } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';
import { ChannelItem } from '../../interfaces/public-api';
import docsearch from 'docsearch.js';

@Component({
    selector: 'dg-navbar',
    templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {
    @HostBinding('class.dg-navbar') isNavbar = true;

    @HostBinding('class.show') showNav = false;

    channels: ChannelItem[];

    constructor(public global: GlobalContext, public navigationService: NavigationService, private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {
        this.channels = this.navigationService.getChannels();
        this.elementRef.nativeElement.classList.add(this.global.config.theme);
        this.initAlgolia();
    }

    toggleNavbar() {
        this.showNav = !this.showNav;
    }

    initAlgolia() {
        if (this.global.config.algolia) {
            const algolia = this.global.config.algolia.appId
                ? {
                      appId: this.global.config.algolia.appId,
                      apiKey: this.global.config.algolia.apiKey,
                      indexName: this.global.config.algolia.indexName
                  }
                : {
                      apiKey: this.global.config.algolia.apiKey,
                      indexName: this.global.config.algolia.indexName
                  };

            docsearch({
                ...algolia,
                inputSelector: '#inputSearch',
                // debug: true
            });
        }
    }

    search() {}
}
