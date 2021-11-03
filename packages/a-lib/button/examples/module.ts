import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlibButtonBasicExampleComponent } from './basic/basic.component';
import { AlibButtonAdvanceExampleComponent } from './advance/advance.component';
import { AlibButtonModule } from '@docgeni/alib/button';
import { AlibButtonAdvanceTitleExampleComponent } from './advance-title/advance-title.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [AlibButtonBasicExampleComponent, AlibButtonAdvanceExampleComponent, AlibButtonAdvanceTitleExampleComponent],
    imports: [CommonModule, AlibButtonModule, FormsModule],
    entryComponents: [AlibButtonBasicExampleComponent, AlibButtonAdvanceExampleComponent, AlibButtonAdvanceTitleExampleComponent],
    exports: [AlibButtonBasicExampleComponent, AlibButtonAdvanceExampleComponent, AlibButtonAdvanceTitleExampleComponent],
    providers: []
})
export class AlibButtonExamplesModule {}
