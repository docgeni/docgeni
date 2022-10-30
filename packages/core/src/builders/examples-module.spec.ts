import { createNgSourceFile } from '@docgeni/ngdoc';
import { generateComponentExamplesModule } from './examples-module';
import * as utils from '../ast-utils';
import { compatibleNormalize } from '../markdown';

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

    it('should generate module success with mock', async () => {
        const ngSourceFile = createNgSourceFile('module.ts', sourceText);
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component' }];
        const getNgModuleMetadataFromDefaultExportSpy = spyOn(utils, 'getNgModuleMetadataFromDefaultExport');
        const combineNgModuleMetaDataSpy = spyOn(utils, 'combineNgModuleMetaData');
        const generateComponentsModuleSpy = spyOn(utils, 'generateComponentsModule');

        const metaData = {
            declarations: ['AppComponent', 'AlibComponent'],
            entryComponents: ['AlibComponent'],
            providers: ['AppService'],
            imports: ['CommonModule'],
            exports: ['AlibComponent']
        };
        combineNgModuleMetaDataSpy.and.returnValue(metaData);

        getNgModuleMetadataFromDefaultExportSpy.and.returnValue({
            declarations: ['AlertComponent']
        });

        const componentModuleText = `module Text`;
        generateComponentsModuleSpy.and.returnValue(componentModuleText);

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

        expect(getNgModuleMetadataFromDefaultExportSpy).toHaveBeenCalledTimes(1);
        expect(getNgModuleMetadataFromDefaultExportSpy).toHaveBeenCalledWith(ngSourceFile);

        expect(combineNgModuleMetaDataSpy).toHaveBeenCalledTimes(1);
        expect(combineNgModuleMetaDataSpy).toHaveBeenCalledWith(
            { declarations: ['AlertComponent'] },
            {
                imports: ['CommonModule'],
                declarations: ['AlibComponent'],
                entryComponents: ['AlibComponent'],
                exports: ['AlibComponent']
            }
        );

        expect(generateComponentsModuleSpy).toHaveBeenCalled();
        expect(generateComponentsModuleSpy).toHaveBeenCalledWith(ngSourceFile, moduleText, [
            ...components,
            { name: 'CommonModule', moduleSpecifier: '@angular/common' },
            { name: 'NgModule', moduleSpecifier: '@angular/core' }
        ]);

        expect(output).toEqual(componentModuleText);
    });

    it('should generate module success ', async () => {
        const ngSourceFile = createNgSourceFile('module.ts', sourceText);
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component' }];
        const metaData = {
            declarations: ['AppComponent', 'AlibComponent'],
            entryComponents: ['AlibComponent'],
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
        expect(output).not.toContain(`export default`);
    });

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
    it('should generate module with vars myProviders ', async () => {
        const ngSourceFile = createNgSourceFile('module.ts', sourceTextWithVarsProviders);
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component' }];

        const output = await generateComponentExamplesModule(ngSourceFile, 'MyButtonExamplesModule', components);
        expect(output).toContain(`const myProviders = [ AppService ];`);
        expect(output).toContain(`providers: [ ...myProviders ]`);
    });
});
