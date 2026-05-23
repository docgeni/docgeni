import {
    afterNextRender,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Directive,
    effect,
    ElementRef,
    input,
    OnInit,
    signal,
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
    element = input<Element>(undefined, { alias: 'appendChildrenDom' });

    constructor(private elementRef: ElementRef<HTMLElement>) {
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
export class DocgeniTabsComponent extends DocgeniBuiltInComponent implements OnInit {
    readonly tabs = signal<DocgeniTabItem[]>([]);
    readonly activeIndex = signal(0);
    readonly mode = input<DocgeniTabsMode>('simple');

    constructor(
        elementRef: ElementRef<HTMLElement>,
        private cdr: ChangeDetectorRef,
    ) {
        super(elementRef);

        effect(() => {
            const mode = this.mode();
            this.updateHostClass(mode ? [`dg-tabs-mode-${mode}`] : []);
        });

        afterNextRender(() => {
            this.parseTabsFromHost();
        });
    }

    ngOnInit(): void {}

    selectTab(index: number): void {
        this.activeIndex.set(index);
    }

    private parseTabsFromHost(): void {
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
