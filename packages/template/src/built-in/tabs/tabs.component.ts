import { isPlatformBrowser } from '@angular/common';
import {
    afterNextRender,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Directive,
    effect,
    ElementRef,
    input,
    PLATFORM_ID,
    signal,
    inject,
} from '@angular/core';
import { DocgeniBuiltInComponent } from '../built-in-component';

export type DocgeniTabsMode = 'simple' | 'code-group';

export interface DocgeniTabItem {
    label: string;
    contentElement: Element;
}

@Directive({
    selector: '[appendChildrenDom]',
})
export class AppendChildrenDom {
    private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    element = input<Element>(undefined, { alias: 'appendChildrenDom' });

    constructor() {
        effect(() => {
            if (this.element()) {
                this.elementRef.nativeElement.appendChild(this.element()!);
            }
        });
    }
}

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    host: {
        class: 'dg-tabs-host dg-tabs',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [AppendChildrenDom],
})
export class DocgeniTabsComponent extends DocgeniBuiltInComponent {
    private cdr = inject(ChangeDetectorRef);
    private platformId = inject(PLATFORM_ID);
    private isBrowser = isPlatformBrowser(this.platformId);

    readonly tabs = signal<DocgeniTabItem[]>([]);
    readonly activeIndex = signal(0);
    readonly mode = input<DocgeniTabsMode>('simple');

    private readonly modeClassEffect = effect(() => {
        const mode = this.mode();
        this.updateHostClass(mode ? [`dg-tabs-mode-${mode}`] : []);
    });

    private readonly parseTabsEffect = afterNextRender(() => {
        this.parseTabsFromHost();
    });

    selectTab(index: number): void {
        this.activeIndex.set(index);
    }

    private parseTabsFromHost(): void {
        if (!this.isBrowser) {
            return;
        }

        const tabElements = Array.from(this.hostElement.querySelectorAll('tab'));
        if (tabElements.length === 0) {
            return;
        }

        const items: DocgeniTabItem[] = tabElements.map((element, index) => ({
            label: element.getAttribute('label')?.trim() || `Tab ${index + 1}`,
            contentElement: element,
        }));

        // tabElements.forEach((element) => element.remove());
        this.tabs.set(items);
        this.activeIndex.set(0);
    }
}

export default {
    selector: 'tabs',
    component: DocgeniTabsComponent,
};
