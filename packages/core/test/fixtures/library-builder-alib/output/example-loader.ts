import { Injectable } from '@angular/core';
import { ExampleLoader, ExampleLoadResult } from '@docgeni/template';
import { EXAMPLE_COMPONENTS } from './component-examples';

@Injectable()
export class LibExampleLoader extends ExampleLoader {

    override enableIvy = true;

    'alib/button'() {
       return import('./components/alib/button/index');
    }

    load(exampleKey: string): Promise<ExampleLoadResult> {
        const example = (EXAMPLE_COMPONENTS as Record<string, any>)[exampleKey];
        return new Promise(resolve => {
            (this as any)[example.module.importSpecifier]().then((result: any) => {
                resolve({
                    moduleType: result.EXAMPLES_MODULE,
                    componentType: result.EXAMPLE_COMPONENTS[exampleKey],
                    example
                });
            });
        });
    }

}

export const LIB_EXAMPLE_LOADER_PROVIDER = {
    provide: ExampleLoader,
    useClass: LibExampleLoader
};
