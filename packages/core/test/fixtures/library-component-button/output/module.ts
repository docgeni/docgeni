import { NgModule } from '@angular/core';
import { AlibButtonBasicExampleComponent } from './basic/basic.component';
import { AlibButtonAdvanceCustomExampleComponent } from './advance/advance.component';

@NgModule({
    declarations: [AlibButtonBasicExampleComponent, AlibButtonAdvanceCustomExampleComponent],
    entryComponents: [AlibButtonBasicExampleComponent, AlibButtonAdvanceCustomExampleComponent]
})
export class AlibButtonExamplesModule {}
