import { createNgSourceFile } from '@docgeni/ngdoc';
import { generateComponentExamplesModule } from './examples-module';
import * as utils from '../ast-utils';

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
    const ngSourceFile = createNgSourceFile('module.ts', sourceText);

    it('should generate module success ', async () => {
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component' }];
        const getNgModuleMetadataFromDefaultExportSpy = spyOn(utils, 'getNgModuleMetadataFromDefaultExport');
        const combineNgModuleMetaDataSpy = spyOn(utils, 'combineNgModuleMetaData');
        const generateComponentsModuleSpy = spyOn(utils, 'generateComponentsModule');

        const metaData = {
            declarations: ['AlibComponent', 'AppComponent'],
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
});
