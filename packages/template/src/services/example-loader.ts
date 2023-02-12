import { Injectable, Type } from '@angular/core';
import { LiveExample } from '../interfaces/public-api';

export interface ExampleLoadResult {
    moduleType: Type<any>;
    componentType: Type<any>;
    example: LiveExample;
}
@Injectable()
export abstract class ExampleLoader {
    enableIvy!: boolean;
    abstract load(exampleName: string): Promise<ExampleLoadResult>;
}
