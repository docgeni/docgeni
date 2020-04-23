import { Component, OnInit, HostBinding, Input, Type, NgModuleFactory, ɵNgModuleFactory } from '@angular/core';
import { LiveExample } from '../../interfaces';
import { ExampleLoader } from '../../services/example-loader';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'dg-example-viewer',
    templateUrl: './example-viewer.component.html'
})
export class ExampleViewerComponent implements OnInit {
    @HostBinding('class.dg-example-viewer') isExampleViewer = true;

    example: LiveExample;

    @Input() exampleName: string;

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    constructor(private exampleLoader: ExampleLoader, private http: HttpClient) {}

    ngOnInit(): void {
        this.exampleLoader.load(this.exampleName).then(result => {
            this.exampleModuleFactory = new ɵNgModuleFactory(result.moduleType);
            this.exampleComponentType = result.componentType;
            this.example = result.example;
            this.loadExampleSource();
        });
    }

    loadExampleSource() {
        this.http
            .get(
                `/assets/examples-source/${this.example.module.importSpecifier}/${this.example.name}/${this.example.name}.component.html`,
                {
                    responseType: 'text'
                }
            )
            .subscribe(result => {
                console.log(result);
            });
    }
}
