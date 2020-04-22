import { Component, OnInit, HostBinding } from '@angular/core';
import { DocComponentViewerComponent } from '../component-viewer.component';
import { NavigationService } from '../../../services';

@Component({
    selector: 'doc-component-examples',
    templateUrl: './component-examples.component.html'
})
export class DocComponentExamplesComponent implements OnInit {
    @HostBinding('class.doc-examples') isComponentExamples = true;

    get examples() {
        return this.docComponentViewer.docItem.examples || [];
    }

    constructor(public docComponentViewer: DocComponentViewerComponent, public navigationService: NavigationService) {
    }

    ngOnInit(): void {}
}
