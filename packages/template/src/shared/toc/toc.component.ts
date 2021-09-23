import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { DOCUMENT, LocationStrategy, ViewportScroller } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GlobalContext } from '../../services/global-context';
import { TocLink, TocService } from '../../services/toc.service';

let OFFSET = 60;

@Component({
    selector: 'dg-toc',
    templateUrl: './toc.component.html'
})
export class TableOfContentsComponent implements OnInit, AfterViewInit, OnDestroy {
    @HostBinding(`class.dg-toc`) isToc = true;

    @Input() container: string = '.dg-scroll-container';

    links: TocLink[] = [];
    activeLink: TocLink = null;

    rootUrl = this.locationStrategy.path(false);

    public highestLevel: number;

    @HostBinding('class.dg-d-none')
    private hideToc = true;

    private destroyed = new Subject();

    private urlFragment = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        @Inject(DOCUMENT) private document: any,
        private viewportScroller: ViewportScroller,
        global: GlobalContext,
        private locationStrategy: LocationStrategy,
        public tocService: TocService
    ) {
        if (global.config.mode === 'lite') {
            OFFSET = 0;
        }
        this.router.events.pipe(takeUntil(this.destroyed)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                const rootUrl = this.locationStrategy.path(false);
                if (rootUrl !== this.rootUrl) {
                    this.rootUrl = rootUrl;
                }
            }
        });

        this.viewportScroller.setOffset([0, OFFSET]);

        this.route.fragment.pipe(takeUntil(this.destroyed)).subscribe(fragment => {
            this.urlFragment = fragment;
            this.viewportScroller.scrollToAnchor(this.urlFragment);
        });

        this.tocService.links$.pipe(takeUntil(this.destroyed)).subscribe(links => {
            this.hideToc = !links || links.length === 0;
            this.updateScrollPosition();
        });
        this.tocService.activeLink$.pipe(takeUntil(this.destroyed)).subscribe(activeLink => {
            this.activeLink = activeLink;
        });
    }

    ngOnInit(): void {}

    ngAfterViewInit() {
        this.updateScrollPosition();
    }

    ngOnDestroy(): void {
        this.destroyed.next();
    }

    updateScrollPosition(): void {
        this.viewportScroller.scrollToAnchor(this.urlFragment);
    }

    onLinkClick($event: Event, link: TocLink) {
        // 当前的 urlFragment 和点击相同，阻止默认行为，因为浏览器会按照整个文档可视区域滚动，
        // 但是我们头部的导航会占用位置，viewportScroller 设置的 offset 为 [0, 60]
        if (link.id === this.urlFragment) {
            $event.preventDefault();
        }
    }
}
