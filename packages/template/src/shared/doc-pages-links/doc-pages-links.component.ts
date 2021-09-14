import { Component, Input } from '@angular/core';
import { NavigationItem } from '@docgeni/template';

@Component({
    selector: 'dg-doc-pages-links',
    templateUrl: './doc-pages-links.component.html'
})
export class DocPagesLinksComponent {
    @Input() docPages: {
        pre: NavigationItem;
        next: NavigationItem;
    };
    constructor() {}
}
