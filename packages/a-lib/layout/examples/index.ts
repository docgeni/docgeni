import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibLayoutBasicExampleComponent } from './basic/basic.component';
import { AlibLayoutAdvanceExampleComponent } from './advance/advance.component';

@NgModule({
    declarations: [AlibLayoutBasicExampleComponent, AlibLayoutAdvanceExampleComponent],
    imports: [CommonModule],
    exports: [AlibLayoutBasicExampleComponent, AlibLayoutAdvanceExampleComponent],
    providers: []
})
export class AlibLayoutExamplesModule {}
