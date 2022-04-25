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

        const moduleMetadataArgs = Object.keys(metaData)
            .map(key => {
                return `${key}: [ ${metaData[key].join(', ')} ]`;
            })
            .join(',\n    ');

        const moduleText = `
@NgModule({
${moduleMetadataArgs}
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
            { name: 'AlibComponent', moduleSpecifier: './alib/alib.component' },
            { name: 'CommonModule', moduleSpecifier: '@angular/common' },
            { name: 'NgModule', moduleSpecifier: '@angular/core' },
            { name: 'addBuiltInComponents', moduleSpecifier: '@docgeni/template' }
        ]);
    });
});
