import { Component, Input, OnInit } from '@angular/core';
import { NavigationItem } from '@docgeni/template';
import { GlobalContext } from '@docgeni/template/services/public-api';

@Component({
    selector: 'dg-doc-pages-links',
    templateUrl: './doc-pages-links.component.html'
})
export class DocPagesLinksComponent implements OnInit {
    @Input() docPages: {
        pre: NavigationItem;
        next: NavigationItem;
    };
    preRouterLink: string;
    nextRouterLink: string;
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
