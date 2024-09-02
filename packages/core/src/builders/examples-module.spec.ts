import { createNgSourceFile } from '@docgeni/ngdoc';
import { generateComponentExamplesModule } from './examples-module';

describe('#examples-module', () => {
    const sourceText = `
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

export default {
    imports: [ CommonModule ],
    declarations: [ AppComponent ],
    providers: [ AppService ]
};
    `;

    it('should generate module success ', async () => {
        const ngSourceFile = createNgSourceFile('module.ts', sourceText);
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component', standalone: false }];
        const metaData = {
            declarations: ['AppComponent', 'AlibComponent'],
            providers: ['AppService'],
            imports: ['CommonModule'],
            exports: ['AlibComponent']
        };

        const moduleMetadataArgs = Object.keys(metaData)
            .map(key => {
                return `${key}: [ ${metaData[key].join(', ')} ]`;
            })
            .join(',\n    ');
        const moduleText = `
@NgModule({
    ${moduleMetadataArgs}
})
export class MyButtonExamplesModule {}
`;

        const output = await generateComponentExamplesModule(ngSourceFile, 'MyButtonExamplesModule', components);
        expect(output).toContain(moduleText);
        expect(output).toContain(`import { AlibComponent } from './basic.component';`);
        expect(output).toContain(`import { NgModule } from '@angular/core';`);
        expect(output).toContain(`exports: [ AlibComponent ]`);
        expect(output).not.toContain(`export default`);
    });

    it('should generate module with standalone component ', async () => {
        const sourceText = `
        import { CommonModule } from '@angular/common';
        import { AppComponent } from './app.component';

        export default {
            imports: [ CommonModule ],
            declarations: [ AppComponent ]
        };
            `;
        const ngSourceFile = createNgSourceFile('module.ts', sourceText);
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component', standalone: true }];

        const output = await generateComponentExamplesModule(ngSourceFile, 'MyButtonExamplesModule', components);
        expect(output).toContain(`imports: [ CommonModule, AlibComponent ]`);
        expect(output).toContain(`exports: [ AlibComponent ]`);
    });

    it('should generate module with vars myProviders ', async () => {
        const sourceTextWithVarsProviders = `
        import { CommonModule } from '@angular/common';
        import { AppComponent } from './app.component';

        const myProviders = [ AppService ];
        export default {
            imports: [ CommonModule ],
            declarations: [ AppComponent ],
            providers: myProviders
        };
            `;
        const ngSourceFile = createNgSourceFile('module.ts', sourceTextWithVarsProviders);
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component', standalone: false }];

        const output = await generateComponentExamplesModule(ngSourceFile, 'MyButtonExamplesModule', components);
        expect(output).toContain(`const myProviders = [ AppService ];`);
        expect(output).toContain(`providers: [ ...myProviders ]`);
    });

    it('should generate module with forRoot ', async () => {
        const sourceTextWithVarsProviders = `
        import { CommonModule } from '@angular/common';
        import { AppComponent } from './app.component';
        export default {
            imports: [ CommonModule ],
            declarations: [ AppComponent ],
            providers: [ RouterModule.forRoot([1, a, "b"])]
        };
            `;
        const ngSourceFile = createNgSourceFile('module.ts', sourceTextWithVarsProviders);
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component', standalone: false }];

        const output = await generateComponentExamplesModule(ngSourceFile, 'MyButtonExamplesModule', components);
        expect(output).toContain(`RouterModule.forRoot([1, a, "b"])`);
    });
});
