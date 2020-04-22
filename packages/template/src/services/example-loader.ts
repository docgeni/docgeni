import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';

export interface ExampleLoadResult {
    moduleType: Type<any>;
    componentType: Type<any>;
}
@Injectable()
export abstract class ExampleLoader {
    abstract load(importSpecifier: string, exampleComponentName: string): Promise<ExampleLoadResult>;
}
