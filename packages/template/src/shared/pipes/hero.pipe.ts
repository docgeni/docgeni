import { Pipe, PipeTransform } from '@angular/core';
import { HeroAction } from '../../interfaces';

@Pipe({ name: 'dgHeroActionClass', standalone: false })
export class HeroActionClassPipe implements PipeTransform {
    constructor() {}

    transform(action: HeroAction): string[] {
        return [`dg-btn-${action.btnType || 'primary-light'}`, 'dg-btn-xlg', `dg-btn-${action.btnShape || 'round'}`];
    }
}
