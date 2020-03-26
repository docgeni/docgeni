import { Component, OnInit } from '@angular/core';
import { NavigationService, NavigationItem, ConfigService } from '../../services';

@Component({
    selector: 'doc-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    navs: NavigationItem[];

    constructor(public config: ConfigService, public navigationService: NavigationService) {}

    ngOnInit(): void {
        this.navs = this.navigationService.getPrimaryNavs();
    }
}
