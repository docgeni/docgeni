import { Component, OnInit, HostBinding, ElementRef } from '@angular/core';
import { GlobalContext } from '../../services/global-context';

@Component({
    selector: 'dg-footer',
    templateUrl: './footer.component.html',
    host: {
        class: 'dg-footer',
    },
    standalone: false,
})
export class FooterComponent implements OnInit {
    @HostBinding(`class.dg-hidden`) isHide = true;

    constructor(
        private global: GlobalContext,
        private elementRef: ElementRef,
    ) {}

    ngOnInit(): void {
        if (this.global.config.footer) {
            this.elementRef.nativeElement.innerHTML = this.global.config.footer;
            this.isHide = false;
        } else {
            this.isHide = true;
        }
    }
}
