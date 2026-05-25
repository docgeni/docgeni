import { Component, OnInit, HostBinding, ElementRef, inject } from '@angular/core';
import { GlobalContext } from '../../services/global-context';

@Component({
    selector: 'dg-footer',
    templateUrl: './footer.component.html',
    host: {
        class: 'dg-footer',
    },
})
export class FooterComponent implements OnInit {
    private global = inject(GlobalContext);
    private elementRef = inject(ElementRef);

    @HostBinding(`class.dg-hidden`) isHide = true;

    ngOnInit(): void {
        if (this.global.config.footer) {
            this.elementRef.nativeElement.innerHTML = this.global.config.footer;
            this.isHide = false;
        } else {
            this.isHide = true;
        }
    }
}
