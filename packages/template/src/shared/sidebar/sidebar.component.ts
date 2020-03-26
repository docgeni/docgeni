import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { NavigationItem } from '../../services';

@Component({
    selector: 'doc-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    @HostBinding(`class.sidebar`) isSidebar = true;

    @Input() navs: NavigationItem[];

    constructor() {}

    ngOnInit(): void {}
}
