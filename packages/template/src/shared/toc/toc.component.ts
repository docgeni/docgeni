import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

interface LinkSection {
    name: string;
    links: Link[];
}

interface Link {
    /* id of the section*/
    id: string;

    /* header type h3/h4 */
    type: string;

    /* If the anchor is in view of the page */
    active: boolean;

    /* name of the anchor */
    name: string;

    /* top offset px of the anchor */
    top: number;
}

@Component({
    selector: 'dg-toc',
    templateUrl: './toc.component.html'
})
export class TableOfContentsComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding(`class.dg-toc`) isToc = true;

    @Input() container: string;

    linkSections: LinkSection[] = [];
    links: Link[] = [];

    rootUrl = this.router.url.split('#')[0];
    private scrollContainer: any;
    private destroyed = new Subject();
    private urlFragment = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private element: ElementRef,
        @Inject(DOCUMENT) private document: Document,
        private viewportScroller: ViewportScroller
    ) {
        this.router.events.pipe(takeUntil(this.destroyed)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                const rootUrl = router.url.split('#')[0];
                if (rootUrl !== this.rootUrl) {
                    this.rootUrl = rootUrl;
                }
            }
        });

        this.viewportScroller.setOffset([0, 60]);

        this.route.fragment.pipe(takeUntil(this.destroyed)).subscribe(fragment => {
            this.urlFragment = fragment;
            this.viewportScroller.scrollToAnchor(this.urlFragment);
        });
    }

    ngOnInit(): void {
        // On init, the content element doesn't yet exist, so it's not possible
        // to subscribe to its scroll event until next tick (when it does exist).
        Promise.resolve().then(() => {
            this.scrollContainer = this.container ? this.document.querySelectorAll(this.container)[0] : window;

            if (this.scrollContainer) {
                fromEvent(this.scrollContainer, 'scroll')
                    .pipe(takeUntil(this.destroyed), debounceTime(10))
                    .subscribe(() => this.onScroll());
            }
        });
    }

    ngAfterViewInit() {
        this.updateScrollPosition();
    }

    ngOnDestroy(): void {
        this.destroyed.next();
    }

    updateScrollPosition(): void {
        this.viewportScroller.scrollToAnchor(this.urlFragment);
    }

    resetHeaders() {
        this.linkSections = [];
        this.links = [];
    }

    addHeaders(sectionName: string, docViewerContent: HTMLElement, sectionIndex = 0) {
        const headers = Array.from<HTMLHeadingElement>(docViewerContent.querySelectorAll('h1, h2, h3, h4'));
        const links: Link[] = [];
        headers.forEach(header => {
            // remove the 'link' icon name from the inner text
            const name = header.innerText.trim().replace(/^link/, '');
            const { top } = header.getBoundingClientRect();
            links.push({
                name,
                type: header.tagName.toLowerCase(),
                top,
                id: header.id,
                active: false
            });
        });
        this.linkSections[sectionIndex] = { name: sectionName, links };
        this.links.push(...links);
    }

    /** Gets the scroll offset of the scroll container */
    private getScrollOffset(): number | void {
        const { top } = this.element.nativeElement.getBoundingClientRect();
        if (typeof this.scrollContainer.scrollTop !== 'undefined') {
            return this.scrollContainer.scrollTop + top;
        } else if (typeof this.scrollContainer.pageYOffset !== 'undefined') {
            return this.scrollContainer.pageYOffset + top;
        }
    }

    private onScroll(): void {
        for (let i = 0; i < this.links.length; i++) {
            this.links[i].active = this.isLinkActive(this.links[i], this.links[i + 1]);
        }
    }

    private isLinkActive(currentLink: any, nextLink: any): boolean {
        // A link is considered active if the page is scrolled passed the anchor without also
        // being scrolled passed the next link
        const scrollOffset = this.getScrollOffset();
        return scrollOffset >= currentLink.top && !(nextLink && nextLink.top < scrollOffset);
    }

    onLinkClick($event: Event, link: Link) {
        // 当前的 urlFragment 和点击相同，阻止默认行为，因为浏览器会按照整个文档可视区域滚动，
        // 但是我们头部的导航会占用位置，viewportScroller 设置的 offset 为 [0, 60]
        if (link.id === this.urlFragment) {
            $event.preventDefault();
        }
    }
}
