import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentDocItem } from '../../interfaces/public-api';

@Component({
    selector: 'dg-component-viewer',
    templateUrl: './component-viewer.component.html'
})
export class ComponentViewerComponent implements OnInit {
    @HostBinding(`class.dg-component-viewer`) isDocViewer = true;

    @Input() docItem: ComponentDocItem;
    currentTabName: string;
    constructor(activatedRoute: ActivatedRoute) {
        if (activatedRoute.firstChild.snapshot.url.length) {
            this.currentTabName = activatedRoute.firstChild.snapshot.url[0].path;
        } else {
            this.currentTabName = 'overview';
        }
    }

    ngOnInit(): void {}
    changeTab(name: string) {
        this.currentTabName = name;
    }
}

@Component({
    selector: 'dg-component-empty',
    template: `
        <p>Current component has not been documented.</p>
    `
})
export class ComponentEmptyComponent implements OnInit {
    @HostBinding(`class.dg-component-empty`) isDocEmpty = true;

    constructor() {}

    ngOnInit(): void {}
}
