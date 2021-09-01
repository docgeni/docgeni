import { Component, ElementRef, HostBinding, Input, OnInit } from '@angular/core';
import { DocgeniBuiltInComponent } from '../built-in-component';

export type DocgeniLabelType = 'primary' | 'danger' | 'warning' | 'info' | '';

@Component({
    selector: 'label',
    templateUrl: './label.component.html',
    host: {
        class: 'dg-label'
    }
})
export class DocgeniLabelComponent extends DocgeniBuiltInComponent implements OnInit {
    private internalType: DocgeniLabelType = 'primary';

    @HostBinding(`class`) classList: string[];

    get type(): DocgeniLabelType {
        return this.internalType;
    }

    @Input() set type(value: DocgeniLabelType) {
        this.internalType = value;
        this.updateHostClass([`dg-label-${this.type}`]);
    }

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
    }

    ngOnInit(): void {
        this.updateHostClass([`dg-label-${this.type}`]);
    }
}

export default {
    selector: 'dg-label',
    component: DocgeniLabelComponent
};
