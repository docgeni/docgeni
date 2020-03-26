import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibFooBasicExampleComponent } from './basic/basic.component';
import { AlibFooAdvanceExampleComponent } from './advance/advance.component';

@NgModule({
    declarations: [AlibFooBasicExampleComponent, AlibFooAdvanceExampleComponent],
    imports: [CommonModule],
    exports: [AlibFooBasicExampleComponent, AlibFooAdvanceExampleComponent],
    providers: []
})
export class AlibFooExamplesModule {}
