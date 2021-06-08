import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { NavigationItem } from '../../interfaces/public-api';
import { GlobalContext } from '../../services/global-context';

@Component({
    selector: 'dg-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    @HostBinding(`class.dg-sidebar`) isSidebar = true;

    @Input() menus: NavigationItem[];

    locale: string;

    constructor(public global: GlobalContext) {}

    ngOnInit(): void {
        this.locale = this.global.locale;
    }

    localeModelChange() {
        this.global.setLocale(this.locale);
        location.href = location.href;
    }
}
