import {
    Component,
    effect,
    EventEmitter,
    input,
    linkedSignal,
    NgModuleFactory,
    OnInit,
    Output,
    signal,
    Type,
    ɵNgModuleFactory,
} from '@angular/core';
import { LiveExample } from '../../interfaces/example';
import { ExampleLoader } from '../../services/example-loader';

@Component({
    selector: 'dg-example-renderer, [dgExampleRenderer]',
    templateUrl: './example-renderer.component.html',
    standalone: false,
})
export class ExampleRendererComponent implements OnInit {
    /** Component type for the current example. */
    componentType = linkedSignal(() => {
        return this.exampleComponentType();
    });

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    name = input<string>();

    exampleModuleType = input<Type<any> | null>(null);

    exampleComponentType = input<Type<any>>();

    @Output() exampleLoadSuccess = new EventEmitter<LiveExample>();

    get enableIvy() {
        return this.exampleLoader.enableIvy;
    }

    constructor(private exampleLoader: ExampleLoader) {
        effect(() => {
            const name = this.name();
            if (name) {
                this.load(name);
            }
        });
    }

    ngOnInit(): void {}

    load(name: string) {
        this.exampleLoader.load(name).then((result) => {
            this.exampleModuleFactory = new ɵNgModuleFactory(result.moduleType);
            this.componentType.set(result.componentType);
            this.exampleLoadSuccess.emit(result.example);
        });
    }
}
