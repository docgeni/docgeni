import { Component, OnInit, HostBinding, ElementRef } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';

@Component({
    selector: 'dg-navbar',
    templateUrl: './navbar.component.html',
    standalone: false,
})
export class NavbarComponent implements OnInit {
    @HostBinding('class.dg-navbar') isNavbar = true;

    @HostBinding('class.show') showNav = false;

    constructor(
        public global: GlobalContext,
        public navigationService: NavigationService,
        private elementRef: ElementRef<HTMLElement>,
    ) {}

    ngOnInit(): void {
        this.elementRef.nativeElement.classList.add(this.global.config.theme!);
    }

    toggleNavbar() {
        this.showNav = !this.showNav;
    }
}
