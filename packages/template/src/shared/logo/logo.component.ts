import { GlobalContext } from './../../services/global-context';
import { Component, OnInit, ElementRef, ViewContainerRef, ViewChild, TemplateRef, inject } from '@angular/core';

@Component({
    selector: 'dg-logo',
    templateUrl: './logo.component.html',
})
export class LogoComponent implements OnInit {
    global = inject(GlobalContext);
    private elementRef = inject(ElementRef);
    private viewContainerRef = inject(ViewContainerRef);

    @ViewChild('logo', { static: true }) logoTemplate!: TemplateRef<HTMLElement>;

    ngOnInit(): void {
        this.viewContainerRef.createEmbeddedView(this.logoTemplate);
        // remove host
        const hostElement: Element = this.elementRef.nativeElement;
        hostElement.remove();
    }
}
