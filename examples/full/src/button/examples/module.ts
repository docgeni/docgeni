import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibButtonBasicExampleComponent } from './basic/basic.component';
import { ButtonModule } from 'alib/button';
const COMPONENTS = [AlibButtonBasicExampleComponent];

@NgModule({
    declarations: COMPONENTS,
    imports: [CommonModule, ButtonModule],
    exports: COMPONENTS,
    providers: []
})
export class AlibButtonExamplesModule {}
