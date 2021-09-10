import { Component, EventEmitter, Input, NgModuleFactory, OnInit, Output, Type, ɵNgModuleFactory } from '@angular/core';
import { LiveExample } from '../../interfaces/example';
import { ExampleLoader, ExampleLoadResult } from '../../services/example-loader';

@Component({
    selector: 'dg-example-renderer, [dgExampleRenderer]',
    templateUrl: './example-renderer.component.html'
})
export class ExampleRendererComponent implements OnInit {
    /** Component type for the current example. */
    componentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    @Input() set name(name: string) {
        this.load(name);
    }

    @Input() set exampleModuleType(type: Type<any>) {
        this.exampleModuleFactory = new ɵNgModuleFactory(type);
    }

    @Input() set exampleComponentType(type: Type<any>) {
        this.componentType = type;
    }

    @Output() exampleLoadSuccess = new EventEmitter<LiveExample>();

    get enableIvy() {
        return this.exampleLoader.enableIvy;
    }

    constructor(private exampleLoader: ExampleLoader) {}

    ngOnInit(): void {}

    load(name: string) {
        this.exampleLoader.load(name).then(result => {
            this.exampleModuleFactory = new ɵNgModuleFactory(result.moduleType);
            this.componentType = result.componentType;
            this.exampleLoadSuccess.emit(result.example);
        });
    }
}
