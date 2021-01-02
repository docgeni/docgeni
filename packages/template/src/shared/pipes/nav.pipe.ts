import { NavigationItem } from './../../interfaces/navigation-item';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dgIsComponentDoc' })
export class IsComponentDocPipe implements PipeTransform {
    constructor() {}

    transform(docItem: NavigationItem): boolean {
        return !!docItem.importSpecifier;
    }
}
