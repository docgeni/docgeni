import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'dg-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
    @HostBinding(`class.dg-footer`) isFooter = true;

    constructor() {}

    ngOnInit(): void {}
}
