import { Component, OnInit, HostBinding } from '@angular/core';
import { ComponentViewerComponent } from '../component-viewer.component';
import { NavigationService } from '../../../services';

@Component({
    selector: 'dg-component-examples',
    templateUrl: './component-examples.component.html'
})
export class ComponentExamplesComponent implements OnInit {
    @HostBinding('class.doc-examples') isComponentExamples = true;

    get examples() {
        return this.componentViewer.docItem.examples || [];
    }

    constructor(public componentViewer: ComponentViewerComponent, public navigationService: NavigationService) {
    }

    ngOnInit(): void {}
}
