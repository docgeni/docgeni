import { Component, OnInit, HostBinding } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { GlobalContext } from '../../../services';

const API_DOCS_PATH = `/assets/content/api-docs`;

@Component({
    selector: 'dg-component-api',
    templateUrl: './component-api.component.html'
})
export class ComponentApiComponent implements OnInit {
    contentUrl: string;

    @HostBinding('class.dg-component-api') contentClass = true;

    constructor(public componentViewer: ComponentViewerComponent, private global: GlobalContext) {}

    ngOnInit(): void {
        this.contentUrl = `${API_DOCS_PATH}/${this.componentViewer.docItem.importSpecifier}/${this.global.locale}.html`;
    }
}
