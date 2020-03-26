import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibButtonBasicExampleComponent } from './basic/basic.component';
import { AlibButtonAdvanceExampleComponent } from './advance/advance.component';

@NgModule({
    declarations: [AlibButtonBasicExampleComponent, AlibButtonBasicExampleComponent],
    imports: [CommonModule],
    exports: [AlibButtonAdvanceExampleComponent, AlibButtonAdvanceExampleComponent],
    providers: []
})
export class AlibFooExamplesModule {}
