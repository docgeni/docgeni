import { Component, OnInit, HostBinding, Input, ElementRef } from '@angular/core';

/**
 * Button 2
 */
@Component({
    selector: 'alib-button,[alibButton]',
    template: '<ng-content></ng-content>'
})
export class AlibButtonComponent implements OnInit {
    @HostBinding(`class.dg-btn`) isBtn = true;

    private type: string;

    /**
     * Button Type: `'primary' | 'secondary' | 'danger'`
     * @default primary
     */
    @Input() set alibButton(value: string) {
        if (this.type) {
            this.elementRef.nativeElement.classList.remove(`dg-btn-${this.type}`);
        }
        this.type = value;
        this.elementRef.nativeElement.classList.add(`dg-btn-${this.type}`);
    }

    /**
     * Button Size
     */
    @Input() alibSize: 'xs' | 'sm' | 'md' | 'lg' = 'xs';

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {}
}
