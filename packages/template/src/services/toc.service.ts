import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Injectable, DOCUMENT, PLATFORM_ID, inject, Renderer2 } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { fromEvent, Observable, BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GlobalContext } from './global-context';

export interface TocLink {
    /* id of the section*/
    id: string;

    /* header type h1/h2/h3/h4 */
    type: string;

    /* If the anchor is in view of the page */
    active: boolean;

    /* name of the anchor */
    name: string;

    /* top offset px of the anchor */
    top: number;

    /** level of the section */
    level: number;

    element?: HTMLHeadingElement;
}

let OFFSET = 0;

@Injectable({
    providedIn: 'root',
})
export class TocService {
    private document = inject(DOCUMENT);
    private platformId = inject(PLATFORM_ID);
    private viewportScroller = inject(ViewportScroller);

    private isBrowser = isPlatformBrowser(this.platformId);

    private linksSubject$ = new BehaviorSubject<TocLink[]>([]);
    private activeLinkSubject$ = new BehaviorSubject<TocLink | null>(null);
    private destroyed$ = new Subject<TocLink[] | null>();
    private scrollContainer!: HTMLElement | Window;
    public highestLevel!: number;
    public get links$(): Observable<TocLink[]> {
        return this.linksSubject$.asObservable();
    }

    readonly links = toSignal(this.links$);

    public get activeLink$(): Observable<TocLink | null> {
        return this.activeLinkSubject$.asObservable();
    }

    readonly activeLink = toSignal(this.activeLink$, { initialValue: null });

    constructor() {
        const global = inject(GlobalContext);

        if (global.config.mode === 'lite') {
            OFFSET = 0;
        }
        this.viewportScroller.setOffset([0, OFFSET]);
    }

    reset() {
        this.linksSubject$.next([]);
        this.activeLinkSubject$.next(null);
        this.highestLevel = 0;
        this.destroyed$.next(null);
        this.destroyed$.complete();
    }

    generateToc(docViewerContent: HTMLElement, scrollContainer = '.dg-scroll-container') {
        if (!this.isBrowser) {
            return;
        }
        const headers = Array.from<HTMLHeadingElement>(docViewerContent.querySelectorAll('h1, h2, h3, h4, dg-examples'));
        const links: TocLink[] = [];
        headers.forEach((header) => {
            if (header.tagName === 'DG-EXAMPLES') {
                const allExamples = header.querySelectorAll('example');
                const headerLevel = 2;
                allExamples.forEach((example) => {
                    links.push({
                        name: example.getAttribute('title') as string,
                        type: 'h2',
                        top: this.getElementTop(example as HTMLElement),
                        id: example.getAttribute('name') as string,
                        active: false,
                        level: headerLevel,
                        element: example as HTMLHeadingElement,
                    });
                });
                return;
            }
            // remove the 'TocLink' icon name from the inner text
            const name = header.innerText.trim().replace(/^TocLink/, '');
            const top = this.getElementTop(header);
            const headerLevel = parseInt(header.tagName[1], 10);
            links.push({
                name,
                type: header.tagName.toLowerCase(),
                top,
                id: header.id,
                active: false,
                level: headerLevel,
                element: header,
            });
            this.highestLevel = this.highestLevel && headerLevel > this.highestLevel ? this.highestLevel : headerLevel;
        });
        this.initializeScrollContainer(scrollContainer);
        this.linksSubject$.next(links);
    }

    initializeScrollContainer(scrollContainerSelector: string) {
        this.scrollContainer = scrollContainerSelector ? (this.document.querySelector(scrollContainerSelector) as HTMLElement) : window;

        Promise.resolve().then(() => {
            if (this.scrollContainer) {
                fromEvent(this.scrollContainer, 'scroll')
                    .pipe(takeUntil(this.destroyed$), debounceTime(10))
                    .subscribe(() => this.onScroll());
            }
            this.onScroll();
        });
    }

    onScroll() {
        const scrollOffset = this.getScrollOffset();
        let activeItem: TocLink;
        if (scrollOffset! <= OFFSET + 1) {
            activeItem = this.links()![0];
        } else {
            const itemOffset = this.links()!.find((link) => {
                return link.element!.offsetTop >= scrollOffset!;
            });
            if (itemOffset) {
                activeItem = itemOffset;
            } else {
                activeItem = this.links()![this.links()!.length - 1];
            }
        }

        this.activeLinkSubject$.next(activeItem || null);
    }

    scrollToAnchor(urlFragment: string) {
        if (this.scrollContainer) {
            if (this.scrollContainer === window) {
                this.viewportScroller.scrollToAnchor(urlFragment);
            } else {
                const link = this.links()!.find((link) => {
                    return link.id === urlFragment;
                });
                if (link && this.scrollContainer !== window) {
                    (this.scrollContainer as HTMLElement).scrollTop = link.element!.offsetTop - 10;
                }
            }
        }
    }

    private getElementTop(element: HTMLElement): number {
        if (!isPlatformBrowser(this.platformId)) {
            return 0;
        }
        return element.getBoundingClientRect().top;
    }

    private getScrollOffset(): number {
        if (!this.scrollContainer) {
            return 0;
        }
        if (this.scrollContainer === window) {
            return window.pageYOffset + OFFSET;
        }
        return (this.scrollContainer as HTMLElement).scrollTop + OFFSET;
    }
}
