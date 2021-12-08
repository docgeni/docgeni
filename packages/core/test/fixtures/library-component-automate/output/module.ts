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
    declarations: [ AlibButtonBasicExampleComponent, AlibButtonOtherExampleComponent ],
    entryComponents: [ AlibButtonBasicExampleComponent ],
    providers: [  ],
    imports: [ CommonModule, AlibButtonModule ],
    exports: [ AlibButtonBasicExampleComponent, AlibButtonOtherExampleComponent ]
})
export class AlibButtonExamplesModule {}
