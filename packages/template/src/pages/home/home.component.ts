import { Component, OnInit, HostBinding } from '@angular/core';
import { ConfigService } from '../../services';

@Component({
    selector: 'dg-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    @HostBinding(`class.dg-home`) isHome = true;

    constructor(public config: ConfigService) {}

    ngOnInit(): void {}
}
