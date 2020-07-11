import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { NavigationItem } from '../../interfaces/public-api';

@Component({
    selector: 'dg-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
    @HostBinding(`class.dg-sidebar`) isSidebar = true;

    @Input() menus: NavigationItem[];

    constructor() {}

    ngOnInit(): void {}
}
