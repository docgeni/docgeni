import { Component, OnInit, HostBinding, Input, Type, NgModuleFactory, ɵNgModuleFactory } from '@angular/core';
import { LiveExample } from '../../interfaces';
import { ExampleLoader } from '../../services/example-loader';

@Component({
    selector: 'dg-example-viewer',
    templateUrl: './example-viewer.component.html'
})
export class ExampleViewerComponent implements OnInit {
    @HostBinding('class.dg-example-viewer') isExampleViewer = true;

    @Input() example: LiveExample;

    @Input() exampleName: string;

    @Input() libName: string;

    @Input() componentId: string;

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    constructor(private exampleLoader: ExampleLoader) {}

    ngOnInit(): void {
        this.exampleLoader.load(this.exampleName).then(result => {
            this.exampleModuleFactory = new ɵNgModuleFactory(result.moduleType);
            this.exampleComponentType = result.componentType;
        });
    }
}
