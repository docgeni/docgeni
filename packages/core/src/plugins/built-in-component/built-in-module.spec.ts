import { createNgSourceFile } from '@docgeni/ngdoc';
import * as utils from '../../ast-utils';
import { generateBuiltInComponentsModule } from './built-in-module';
import { ComponentBuilder } from './component-builder';

describe('#built-in-module', () => {
    const sourceText = `
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

export default {
    imports: [ CommonModule ],
    declarations: [ AppComponent ],
    providers: [ AppService ]
};
    `;
    const ngSourceFile = createNgSourceFile('module.ts', sourceText);

    it('should generate module success', async () => {
        const components: ComponentBuilder[] = [
            {
                name: 'alib',
                componentData: { selector: 'a-lib', name: 'AlibComponent' }
            } as ComponentBuilder
        ];

        const moduleText = `
@NgModule({
declarations: [ AppComponent, AlibComponent ],
    entryComponents: [ AlibComponent ],
    providers: [ AppService ],
    imports: [ CommonModule ],
    exports: [ AlibComponent ]
})
export class CustomComponentsModule {
constructor() {
    addBuiltInComponents([
        { selector: 'a-lib', component: AlibComponent },
    ]);
}
}
`;
        const output = await generateBuiltInComponentsModule(ngSourceFile, components);
        console.log(output);
        expect(output).toContain(moduleText);
        expect(output).toContain(`import { addBuiltInComponents } from '@docgeni/template';`);
        expect(output).toContain(`import { AlibComponent } from './alib/alib.component';`);
        expect(output).toContain(`import { NgModule } from '@angular/core';`);
        expect(output).toContain(`import { addBuiltInComponents } from '@docgeni/template';`);
        expect(output).not.toContain(`export default {`);
    });
});
