import { Component, OnInit, HostBinding, input } from '@angular/core';
import { ComponentDocItem } from '../../interfaces/public-api';
import { DocHeaderComponent } from '../../shared/doc-header/doc-header.component';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { DocMetaComponent } from '../../shared/doc-meta/doc-meta.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
    selector: 'dg-component-viewer',
    templateUrl: './component-viewer.component.html',
    host: {
        class: 'dg-component-viewer',
    },
    imports: [DocHeaderComponent, RouterLinkActive, RouterLink, RouterOutlet, DocMetaComponent, TranslatePipe],
})
export class ComponentViewerComponent implements OnInit {
    readonly docItem = input.required<ComponentDocItem>();

    constructor() {}

    ngOnInit(): void {}
}

@Component({
    selector: 'dg-component-empty',
    template: ` <p>Current component has not been documented.</p> `,
    host: {
        class: 'dg-component-empty',
    },
})
export class ComponentEmptyComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
