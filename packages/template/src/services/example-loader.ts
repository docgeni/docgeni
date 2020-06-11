import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { LiveExample } from '../interfaces';

export interface ExampleLoadResult {
    moduleType: Type<any>;
    componentType: Type<any>;
    example: LiveExample;
}
@Injectable()
export abstract class ExampleLoader {
    enableIvy: boolean;
    abstract load(exampleName: string): Promise<ExampleLoadResult>;
}
