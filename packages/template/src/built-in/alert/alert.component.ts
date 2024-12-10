import { Component, ElementRef, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
    private internalType: DocgeniAlertType = 'info';

    get type(): DocgeniAlertType {
        return this.internalType;
    }

    @Input() set type(value: DocgeniAlertType) {
        this.internalType = value;
        this.updateHostClass([`dg-alert-${this.type}`]);
    }

    constructor(elementRef: ElementRef<unknown>) {
        super(elementRef);
    }

    ngOnInit(): void {
        this.updateHostClass([`dg-alert-${this.type}`]);
    }
}

export default {
    selector: 'alert',
    component: DocgeniAlertComponent,
};
