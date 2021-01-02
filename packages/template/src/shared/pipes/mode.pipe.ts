import { NavigationItem } from './../../interfaces/navigation-item';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dgIsLite' })
export class IsModeLitePipe implements PipeTransform {
    constructor() {}

    transform(mode: 'lite' | 'full'): boolean {
        return mode === 'lite';
    }
}

@Pipe({ name: 'dgIsFull' })
export class IsModeFullPipe implements PipeTransform {
    constructor() {}

    transform(mode: 'lite' | 'full'): boolean {
        return mode === 'full';
    }
}
