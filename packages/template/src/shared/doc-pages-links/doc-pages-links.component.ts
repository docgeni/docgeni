import { Component, Input, OnInit } from '@angular/core';
import { NavigationItem } from '../../interfaces';
import { GlobalContext } from '../../services/global-context';

@Component({
    selector: 'dg-doc-pages-links',
    templateUrl: './doc-pages-links.component.html',
    host: {
        class: 'dg-pages-link'
    }
})
export class DocPagesLinksComponent implements OnInit {
    @Input() docPages!: {
        pre: NavigationItem;
        next: NavigationItem;
    };
    preRouterLink!: string;
    nextRouterLink!: string;
    constructor(private globalContext: GlobalContext) {}

    ngOnInit(): void {
        if (this.docPages.pre) {
            this.preRouterLink =
                this.globalContext.config.mode === 'lite'
                    ? `/${this.docPages.pre.path}`
                    : `/${this.docPages.pre.channelPath}/${this.docPages.pre.path}`;
        }
        if (this.docPages.next) {
            this.nextRouterLink =
                this.globalContext.config.mode === 'lite'
                    ? `/${this.docPages.next.path}`
                    : `/${this.docPages.next.channelPath}/${this.docPages.next.path}`;
        }
    }
}
