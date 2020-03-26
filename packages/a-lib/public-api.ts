/*
 * Public API Surface of a-lib
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibButtonModule } from 'a-lib/button';
import { AlibFooModule } from 'a-lib/foo';

@NgModule({
    declarations: [],
    imports: [CommonModule, AlibButtonModule, AlibFooModule],
    exports: [AlibButtonModule],
    providers: []
})
export class AlibModule {}

export * from './button/index';
