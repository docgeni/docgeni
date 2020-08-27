import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostBinding } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { GlobalContext } from '../../../services/public-api';
import { ApiDeclaration } from '../../../interfaces';

@Component({
    selector: 'dg-component-api',
    templateUrl: './component-api.component.html'
})
export class ComponentApiComponent implements OnInit {
    contentUrl: string;

    @HostBinding('class.dg-component-api') contentClass = true;

    @HostBinding('class.dg-doc-content') isDocContent = true;

    apiDeclarations: ApiDeclaration[];

    constructor(public componentViewer: ComponentViewerComponent, private global: GlobalContext, private http: HttpClient) {}

    ngOnInit(): void {
        this.contentUrl = this.global.getAssetsContentPath(
            `api-docs/${this.componentViewer.docItem.importSpecifier}/${this.global.locale}.html`
        );
        const apiUrl = this.global.getAssetsContentPath(
            `api-docs/${this.componentViewer.docItem.importSpecifier}/${this.global.locale}.json`
        );
        this.http.get<ApiDeclaration[]>(apiUrl).subscribe({
            next: data => {
                this.apiDeclarations = data;
            }
        });
    }
}
