import {
    afterNextRender,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    signal,
} from '@angular/core';
import { DocgeniBuiltInComponent } from '../built-in-component';

export interface DocgeniTabItem {
    label: string;
    contentHtml: string;
}

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    host: {
        class: 'dg-tabs-host dg-tabs',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class DocgeniTabsComponent extends DocgeniBuiltInComponent implements OnInit {
    readonly tabs = signal<DocgeniTabItem[]>([]);
    readonly activeIndex = signal(0);

    constructor(
        elementRef: ElementRef<HTMLElement>,
        private cdr: ChangeDetectorRef,
    ) {
        super(elementRef);

        afterNextRender(() => {
            this.parseTabsFromHost();
        });
    }

    ngOnInit(): void {
        // this.updateHostClass(['dg-tabs']);
    }

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
            contentHtml: element.innerHTML.trim(),
        }));

        tabElements.forEach((element) => element.remove());
        this.tabs.set(items);
        this.activeIndex.set(0);
    }
}

export default {
    selector: 'tabs',
    component: DocgeniTabsComponent,
};
