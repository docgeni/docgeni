import { CommonModule } from '@angular/common';
import { AlibButtonModule } from '@docgeni/alib/button';
import { AlibButtonOtherExampleComponent } from './basic/other.component';
import { NgModule } from '@angular/core';
import { AlibButtonBasicExampleComponent } from './basic/basic.component';

export default {
    imports: [CommonModule, AlibButtonModule],
    providers: [],
    declarations: [AlibButtonOtherExampleComponent]
};

@NgModule({
    imports: [ CommonModule, AlibButtonModule ],
    providers: [  ],
    declarations: [ AlibButtonOtherExampleComponent, AlibButtonBasicExampleComponent ],
    entryComponents: [ AlibButtonBasicExampleComponent ],
    exports: [ AlibButtonOtherExampleComponent, AlibButtonBasicExampleComponent ]
})
export class AlibButtonExamplesModule {}
