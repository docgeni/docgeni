import { Component, Input, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'dg-doc-meta',
    templateUrl: './doc-meta.component.html'
})
export class DocMetaComponent implements OnInit {
    @HostBinding(`class.dg-doc-meta`) isDocContribution = true;
    @Input() meta: { lastUpdatedTime: number; contributors: string[] };
    constructor() {}

    ngOnInit() {}
}
