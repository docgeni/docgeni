import { Component, OnInit, HostBinding } from '@angular/core';
import { GlobalContext } from '../../services';

@Component({
    selector: 'dg-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
    @HostBinding(`class.dg-home`) isHome = true;

    constructor(public global: GlobalContext) {}

    ngOnInit(): void {}
}
