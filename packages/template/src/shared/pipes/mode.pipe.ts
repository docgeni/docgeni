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
@Pipe({ name: 'dgDateAutoFormat' })
export class DateAutoFormatPipe implements PipeTransform {
    transform(date: number) {
        return new Date().getFullYear() === new Date(date).getFullYear() ? 'MM/dd HH:mm' : 'yyyy/MM/dd HH:mm';
    }
}
