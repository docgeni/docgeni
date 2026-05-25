import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dgIsContentChildKind' })
export class IsNgContentChildKindPipe implements PipeTransform {
    constructor() {}

    transform(kind: string): boolean {
        return kind === 'ContentChild' || kind === 'ContentChildren';
    }
}
