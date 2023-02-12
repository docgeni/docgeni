import { GlobalContext } from './../../services/global-context';
import { Component, OnInit, ElementRef, ViewContainerRef, ViewChild, TemplateRef } from '@angular/core';

@Component({
    selector: 'dg-logo',
    templateUrl: './logo.component.html'
})
export class LogoComponent implements OnInit {
    @ViewChild('logo', { static: true }) logoTemplate!: TemplateRef<HTMLElement>;

    constructor(public global: GlobalContext, private elementRef: ElementRef, private viewContainerRef: ViewContainerRef) {}

    ngOnInit(): void {
        this.viewContainerRef.createEmbeddedView(this.logoTemplate);
        // remove host
        const hostElement: Element = this.elementRef.nativeElement;
        hostElement.remove();
    }
}
