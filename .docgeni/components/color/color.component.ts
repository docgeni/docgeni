import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { DocgeniBuiltInComponent } from '@docgeni/template';

@Component({
    selector: 'my-color',
    templateUrl: './color.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyColorComponent extends DocgeniBuiltInComponent {
    readonly color = input<string>('');

    private readonly colorEffect = effect(() => {
        if (this.color()) {
            this.hostElement.style.color = this.color();
        }
    });
}

export default {
    selector: 'my-color',
    component: MyColorComponent,
};
