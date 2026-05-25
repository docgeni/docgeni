import { Component, OnInit, ElementRef, signal } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';
import { LogoComponent } from '../logo/logo.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon.component';
import { DropdownDirective } from '../dropdown/dropdown.directive';
import { DropdownMenuComponent } from '../dropdown/dropdown-menu.component';
import { SearchComponent } from '../search/search.component';
import { LocalesSelectorComponent } from '../locales-selector/locales-selector.component';
import { ThemesSelectorComponent } from '../themes-selector/themes-selector.component';
import { IsModeFullPipe } from '../pipes/mode.pipe';

@Component({
    selector: 'dg-navbar',
    templateUrl: './navbar.component.html',
    imports: [
        LogoComponent,
        RouterLink,
        IconComponent,
        DropdownDirective,
        RouterLinkActive,
        DropdownMenuComponent,
        SearchComponent,
        LocalesSelectorComponent,
        ThemesSelectorComponent,
        IsModeFullPipe,
    ],
    host: {
        class: 'dg-navbar',
        '[class.show]': 'showNav()',
    },
})
export class NavbarComponent implements OnInit {
    readonly showNav = signal(false);

    constructor(
        public global: GlobalContext,
        public navigationService: NavigationService,
        private elementRef: ElementRef<HTMLElement>,
    ) {}

    ngOnInit(): void {
        this.elementRef.nativeElement.classList.add(this.global.config.theme!);
    }

    toggleNavbar() {
        this.showNav.update((open) => !open);
    }
}
