import { Component, ChangeDetectionStrategy, input, effect } from '@angular/core';
import { DocgeniBuiltInComponent } from '../built-in-component';

export type DocgeniAlertType = 'primary' | 'info' | 'success' | 'warning' | 'danger';

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    host: {
        class: 'dg-alert',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class DocgeniAlertComponent extends DocgeniBuiltInComponent {
    readonly type = input<DocgeniAlertType>('info');

    private readonly typeClassEffect = effect(() => {
        if (this.type()) {
            this.updateHostClass([`dg-alert-${this.type()}`]);
        }
    });
}

export default {
    selector: 'alert',
    component: DocgeniAlertComponent,
};
