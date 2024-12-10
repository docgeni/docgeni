import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
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
    level?: number;

    element?: HTMLHeadingElement;
}

let OFFSET = 0;

@Injectable({
    providedIn: 'root',
})
export class TocService {
    private linksSubject$ = new BehaviorSubject<TocLink[]>([]);
    private activeLinkSubject$ = new BehaviorSubject<TocLink | null>(null);
    private destroyed$ = new Subject<TocLink[] | null>();
    private scrollContainer!: HTMLElement & Window;
    public highestLevel!: number;
    public get links$(): Observable<TocLink[]> {
        return this.linksSubject$.asObservable();
    }

    public get links() {
        return this.linksSubject$.value;
    }

    public get activeLink$(): Observable<TocLink> {
        return this.activeLinkSubject$.asObservable() as Observable<TocLink>;
    }

    constructor(
        @Inject(DOCUMENT) private document: any,
        global: GlobalContext,
        private viewportScroller: ViewportScroller,
    ) {
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
                        top: example.getBoundingClientRect().top,
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
            const { top } = header.getBoundingClientRect();
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
        this.scrollContainer = scrollContainerSelector ? this.document.querySelectorAll(scrollContainerSelector)[0] : window;

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
            activeItem = this.links[0];
        } else {
            const itemOffset = this.links.find((link) => {
                return link.element!.offsetTop >= scrollOffset!;
            });
            if (itemOffset) {
                activeItem = itemOffset;
            } else {
                activeItem = this.links[this.links.length - 1];
            }
        }

        this.activeLinkSubject$.next(activeItem || null);
    }

    scrollToAnchor(urlFragment: string) {
        if (this.scrollContainer) {
            if (this.scrollContainer === this.document.window) {
                this.viewportScroller.scrollToAnchor(urlFragment);
            } else {
                const link = this.links.find((link) => {
                    return link.id === urlFragment;
                });
                if (link) {
                    this.scrollContainer.scrollTop = link.element!.offsetTop - 10;
                }
            }
        }
    }

    private getScrollOffset(): number {
        if (this.scrollContainer) {
            if (typeof this.scrollContainer.scrollTop !== 'undefined') {
                return this.scrollContainer.scrollTop + OFFSET;
            } else if (typeof this.scrollContainer.pageYOffset !== 'undefined') {
                return this.scrollContainer.pageYOffset + OFFSET;
            }
            return 0;
        } else {
            return 0;
        }
    }
}
