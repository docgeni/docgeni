import { Component, OnInit, HostBinding, inject } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { NavigationService } from '../../../services/public-api';
import { ExampleViewerComponent } from '../../../shared/example-viewer/example-viewer.component';

@Component({
    selector: 'dg-component-examples',
    templateUrl: './component-examples.component.html',
    host: { class: 'dg-examples' },
    imports: [ExampleViewerComponent],
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
