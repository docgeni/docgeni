import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibLayoutBasicExampleComponent } from './basic/basic.component';
import { AlibLayoutAdvanceExampleComponent } from './advance/advance.component';
import { AlibLayoutModule } from 'a-lib/layout';

@NgModule({
    declarations: [AlibLayoutBasicExampleComponent, AlibLayoutAdvanceExampleComponent],
    imports: [CommonModule, AlibLayoutModule],
    exports: [AlibLayoutBasicExampleComponent, AlibLayoutAdvanceExampleComponent],
    providers: []
})
export class AlibLayoutExamplesModule {}
