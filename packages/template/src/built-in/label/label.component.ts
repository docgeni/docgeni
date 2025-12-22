import { ChangeDetectionStrategy, Component, effect, ElementRef, input, Input, OnInit } from '@angular/core';
import { DocgeniBuiltInComponent } from '../built-in-component';

export type DocgeniLabelType = 'primary' | 'danger' | 'warning' | 'info' | '';

@Component({
    selector: 'label',
    templateUrl: './label.component.html',
    host: {
        class: 'dg-label',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class DocgeniLabelComponent extends DocgeniBuiltInComponent implements OnInit {
    readonly type = input<DocgeniLabelType>('primary');

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
        effect(() => {
            if (this.type()) {
                this.updateHostClass([`dg-label-${this.type()}`]);
            }
        });
    }

    ngOnInit(): void {}
}

export default {
    selector: 'label',
    component: DocgeniLabelComponent,
};
