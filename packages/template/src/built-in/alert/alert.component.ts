import { Component, ElementRef, Input, OnInit, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { DocgeniBuiltInComponent } from '../built-in-component';

export type DocgeniAlertType = 'primary' | 'info' | 'success' | 'warning' | 'danger';

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    host: {
        class: 'dg-alert',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class DocgeniAlertComponent extends DocgeniBuiltInComponent implements OnInit {
    readonly type = input<DocgeniAlertType>('info');

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
        effect(() => {
            if (this.type()) {
                this.updateHostClass([`dg-alert-${this.type()}`]);
            }
        });
    }

    ngOnInit(): void {}
}

export default {
    selector: 'alert',
    component: DocgeniAlertComponent,
};
