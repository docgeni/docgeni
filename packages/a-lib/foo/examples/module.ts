import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibFooBasicExampleComponent } from './basic/basic.component';
import { AlibFooAdvanceExampleComponent } from './advance/advance.component';
import { AlibFooModule } from 'a-lib/foo';

@NgModule({
    declarations: [AlibFooBasicExampleComponent, AlibFooAdvanceExampleComponent],
    imports: [CommonModule, AlibFooModule],
    exports: [AlibFooBasicExampleComponent, AlibFooAdvanceExampleComponent],
    providers: []
})
export class AlibFooExamplesModule {}
