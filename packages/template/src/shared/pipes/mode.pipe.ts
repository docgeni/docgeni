import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dgIsLite', standalone: false })
export class IsModeLitePipe implements PipeTransform {
    constructor() {}

    transform(mode?: 'lite' | 'full'): boolean {
        return mode === 'lite';
    }
}

@Pipe({ name: 'dgIsFull', standalone: false })
export class IsModeFullPipe implements PipeTransform {
    constructor() {}

    transform(mode?: 'lite' | 'full'): boolean {
        return mode === 'full';
    }
}
