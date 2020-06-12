import { Component, OnInit, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'dg-doc-header',
    templateUrl: './doc-header.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocHeaderComponent implements OnInit {
    @HostBinding(`class.dg-doc-header`) isHeader = true;

    @Input() title: string;

    @Input() subtitle: string;

    constructor() {}

    ngOnInit(): void {}
}
