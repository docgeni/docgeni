import { Component, OnDestroy, OnInit, HostBinding, input, signal, inject } from '@angular/core';
import { LocationStrategy, AsyncPipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GlobalContext } from '../../services/global-context';
import { TocLink, TocService } from '../../services/toc.service';

let OFFSET = 60;

@Component({
    selector: 'dg-toc',
    templateUrl: './toc.component.html',
    imports: [AsyncPipe],
    host: {
        class: 'dg-toc',
        '[class.dg-d-none]': 'hideToc()',
    },
})
export class TableOfContentsComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    global = inject(GlobalContext);
    private locationStrategy = inject(LocationStrategy);
    public tocService = inject(TocService);

    readonly container = input<string>('.dg-scroll-container');

    links: TocLink[] = [];

    activeLink!: TocLink;

    rootUrl = this.locationStrategy.path(false);

    protected readonly hideToc = signal(true);

    private destroyed = new Subject<void>();

    private urlFragment = '';

    constructor() {
        if (this.global.config.mode === 'lite') {
            OFFSET = 0;
        }
        this.router.events.pipe(takeUntil(this.destroyed)).subscribe((event) => {
            if (event instanceof NavigationEnd) {
                const rootUrl = this.locationStrategy.path(false);
                if (rootUrl !== this.rootUrl) {
                    this.rootUrl = rootUrl;
                }
            }
        });

        this.route.fragment.pipe(takeUntil(this.destroyed)).subscribe((fragment) => {
            this.urlFragment = fragment as string;
            this.tocService.scrollToAnchor(this.urlFragment);
        });

        this.tocService.links$.pipe(takeUntil(this.destroyed)).subscribe((links) => {
            this.hideToc.set(!links || links.length === 0);
            if (!this.hideToc()) {
                this.tocService.scrollToAnchor(this.urlFragment);
            }
        });

        this.tocService.activeLink$.pipe(takeUntil(this.destroyed)).subscribe((activeLink) => {
            this.activeLink = activeLink;
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroyed.next();
    }

    onLinkClick($event: Event, link: TocLink) {
        // 当前的 urlFragment 和点击相同，阻止默认行为，因为浏览器会按照整个文档可视区域滚动，
        // if (link.id === this.urlFragment) {
        //     $event.preventDefault();
        // }
    }
}
