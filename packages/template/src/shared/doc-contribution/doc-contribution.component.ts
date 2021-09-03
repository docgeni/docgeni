import { Component, Input, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'dg-doc-contribution',
    templateUrl: './doc-contribution.component.html'
})
export class DocContributionComponent implements OnInit {
    @HostBinding(`class.dg-doc-contribution`) isDocContribution = true;
    @Input() contributionInfo: { lastUpdateTime: number; contributors: string[] };
    constructor() {}

    ngOnInit() {}
}
