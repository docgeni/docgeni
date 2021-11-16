import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibButtonBasic1ExampleComponent } from './basic/basic.component';
import { AlibButtonAdvanceExampleComponent } from './advance/advance.component';
import { AlibButtonModule } from '@docgeni/alib/button';
import { AlibButtonAdvanceTitleExampleComponent } from './advance-title/advance-title.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [AlibButtonBasic1ExampleComponent, AlibButtonAdvanceExampleComponent, AlibButtonAdvanceTitleExampleComponent],
    imports: [CommonModule, AlibButtonModule, FormsModule],
    entryComponents: [AlibButtonBasic1ExampleComponent, AlibButtonAdvanceExampleComponent, AlibButtonAdvanceTitleExampleComponent],
    exports: [AlibButtonBasic1ExampleComponent, AlibButtonAdvanceExampleComponent, AlibButtonAdvanceTitleExampleComponent],
    providers: []
})
export class AlibButtonExamplesModule {}
