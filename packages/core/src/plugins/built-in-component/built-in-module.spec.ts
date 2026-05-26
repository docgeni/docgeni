import { createNgSourceFile } from '@docgeni/ngdoc';
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
};`;
    const ngSourceFile = createNgSourceFile('module.ts', sourceText);

    it('should generate module success', async () => {
        const components: ComponentBuilder[] = [
            {
                name: 'alib',
                metadata: { selector: 'a-lib', name: 'AlibComponent' },
            } as ComponentBuilder,
        ];

        const moduleText = `
@NgModule({
  declarations: [ AppComponent, AlibComponent ],
    providers: [ AppService ],
    imports: [ CommonModule ],
    exports: [ AlibComponent ]
})
export class CustomComponentsModule {
  constructor() {
    addBuiltInComponents([{ selector: 'a-lib', component: AlibComponent }]);
  }
}`;
        const output = await generateBuiltInComponentsModule(ngSourceFile, components);
        expect(output).toContain(moduleText);
        expect(output).toContain(`import { addBuiltInComponents } from '@docgeni/template';`);
        expect(output).toContain(`import { AlibComponent } from './alib/alib.component';`);
        expect(output).toContain(`import { NgModule } from '@angular/core';`);
        expect(output).toContain(`import { addBuiltInComponents } from '@docgeni/template';`);
        expect(output).not.toContain(`export default {`);
    });

    it('should put standalone components in imports instead of declarations', async () => {
        const components: ComponentBuilder[] = [
            {
                name: 'color',
                metadata: { selector: 'my-color', name: 'MyColorComponent', standalone: true },
            } as ComponentBuilder,
            {
                name: 'legacy',
                metadata: { selector: 'legacy', name: 'LegacyComponent', standalone: false },
            } as ComponentBuilder,
        ];

        const output = await generateBuiltInComponentsModule(ngSourceFile, components);

        expect(output).toContain('declarations: [ AppComponent, LegacyComponent ]');
        expect(output).toContain('imports: [ CommonModule, MyColorComponent ]');
        expect(output).toContain('exports: [ LegacyComponent, MyColorComponent ]');
        expect(output).not.toContain('declarations: [ AppComponent, LegacyComponent, MyColorComponent ]');
    });
});
