import { Pipe, PipeTransform } from '@angular/core';
import { PropertyDeclaration } from '../../interfaces';
import { IsNgContentChildKindPipe } from './ng-kind.pipe';

@Pipe({ name: 'dgPropertyName' })
export class PropertyNamePipe implements PipeTransform {
    constructor() {}

    transform(property: PropertyDeclaration): string {
        const ngContentChildKind = new IsNgContentChildKindPipe();
        const isContentChild = ngContentChildKind.transform(property.kind);
        const name = property.aliasName || property.name;
        if (isContentChild) {
            return `#${name}`;
        } else if (property.kind === 'Output') {
            return `(${name})`;
        } else {
            return `${name}`;
        }
    }
}
