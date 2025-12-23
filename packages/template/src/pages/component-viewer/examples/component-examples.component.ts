import { Component, OnInit, HostBinding, inject } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { NavigationService } from '../../../services/public-api';

@Component({
    selector: 'dg-component-examples',
    templateUrl: './component-examples.component.html',
    host: { class: 'dg-examples' },
    standalone: false,
})
export class ComponentExamplesComponent implements OnInit {
    get examples() {
        return this.componentViewer.docItem().examples || [];
    }

    protected componentViewer = inject(ComponentViewerComponent);

    protected navigationService = inject(NavigationService);

    constructor() {}

    ngOnInit(): void {}
}
