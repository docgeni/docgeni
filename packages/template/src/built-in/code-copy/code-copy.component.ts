import { effect, ChangeDetectionStrategy, Component, ElementRef, HostBinding, HostListener, signal } from '@angular/core';
import { BUILTIN_SVGS } from '../../shared/icon/svgs';
import { CopierService } from '../../shared/copier/copier.service';
import { DocgeniBuiltInComponent } from '../built-in-component';

@Component({
    selector: 'code-copy',
    template: '',
    host: {
        class: 'dg-code-copy dg-icon',
        role: 'button',
        tabindex: '0',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class DocgeniCodeCopyComponent extends DocgeniBuiltInComponent {
    readonly icon = signal<'copy' | 'check'>('copy');

    @HostBinding('attr.title')
    title = 'Copy';

    @HostBinding('attr.aria-label')
    ariaLabel = 'Copy';

    constructor(
        elementRef: ElementRef<HTMLElement>,
        private copier: CopierService,
    ) {
        super(elementRef);

        effect(() => {
            this.icon();
            this.renderIcon();
        });
    }

    private renderIcon(): void {
        this.hostElement.innerHTML = BUILTIN_SVGS[this.icon()] ?? '';
    }

    @HostListener('click', ['$event'])
    onCopy(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        const pre = this.hostElement.closest('pre');
        const code = pre?.querySelector('code');
        const text = code?.textContent ?? '';
        if (!text || !this.copier.copyText(text)) {
            return;
        }

        this.icon.set('check');
        this.title = 'Copied!';

        window.setTimeout(() => {
            this.icon.set('copy');
            this.title = 'Copy';
        }, 2000);
    }
}

export default {
    selector: 'code-copy',
    component: DocgeniCodeCopyComponent,
};
