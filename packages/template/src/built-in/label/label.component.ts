import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { DocgeniBuiltInComponent } from '../built-in-component';

export type DocgeniLabelType = 'primary' | 'danger' | 'warning' | 'info' | '';

@Component({
    selector: 'label',
    templateUrl: './label.component.html',
    host: {
        class: 'dg-label',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class DocgeniLabelComponent extends DocgeniBuiltInComponent {
    readonly type = input<DocgeniLabelType>('primary');

    private readonly typeClassEffect = effect(() => {
        if (this.type()) {
            this.updateHostClass([`dg-label-${this.type()}`]);
        }
    });
}

export default {
    selector: 'label',
    component: DocgeniLabelComponent,
};
