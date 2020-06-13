import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibButtonBasicExampleComponent } from './basic/basic.component';
import { AlibButtonAdvanceExampleComponent } from './advance/advance.component';
import { AlibButtonModule } from 'a-lib/button';
import { AlibButtonAdvanceTitleExampleComponent } from './advance-title/advance-title.component';

@NgModule({
    declarations: [AlibButtonBasicExampleComponent, AlibButtonAdvanceExampleComponent, AlibButtonAdvanceTitleExampleComponent],
    imports: [CommonModule, AlibButtonModule],
    entryComponents: [AlibButtonBasicExampleComponent, AlibButtonAdvanceExampleComponent, AlibButtonAdvanceTitleExampleComponent],
    exports: [AlibButtonBasicExampleComponent, AlibButtonAdvanceExampleComponent, AlibButtonAdvanceTitleExampleComponent],
    providers: []
})
export class AlibButtonExamplesModule {}
