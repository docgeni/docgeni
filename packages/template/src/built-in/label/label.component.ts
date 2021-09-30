import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit } from '@angular/core';
import { DocgeniBuiltInComponent } from '../built-in-component';

export type DocgeniLabelType = 'primary' | 'danger' | 'warning' | 'info' | '';

@Component({
    selector: 'label',
    templateUrl: './label.component.html',
    host: {
        class: 'dg-label'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocgeniLabelComponent extends DocgeniBuiltInComponent implements OnInit {
    private internalType: DocgeniLabelType = 'primary';

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
    selector: 'label',
    component: DocgeniLabelComponent
};
