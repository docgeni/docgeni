import { createNgSourceFile } from '@docgeni/ngdoc';
import * as utils from '../ast-utils';
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
        const components = new Map<string, ComponentBuilder>();
        components.set('./basic.component', {
            name: 'alib',
            componentData: { selector: 'a-lib', name: 'AlibComponent' }
        } as ComponentBuilder);

        const getModuleMetaDataSpy = spyOn(utils, 'getModuleMetaData');
        const generateComponentsModuleSpy = spyOn(utils, 'generateComponentsModule');

        const metaData = {
            declarations: ['AlibComponent', 'AppComponent'],
            entryComponents: ['AlibComponent'],
            providers: ['AppService'],
            imports: ['CommonModule'],
            exports: ['AlibComponent']
        };
        getModuleMetaDataSpy.and.returnValue(Promise.resolve(metaData));

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

        expect(getModuleMetaDataSpy).toHaveBeenCalledTimes(1);
        expect(getModuleMetaDataSpy).toHaveBeenCalledWith(ngSourceFile, {
            imports: ['CommonModule'],
            declarations: ['AlibComponent'],
            entryComponents: ['AlibComponent'],
            exports: ['AlibComponent']
        });

        expect(generateComponentsModuleSpy).toHaveBeenCalled();
        expect(generateComponentsModuleSpy).toHaveBeenCalledWith(ngSourceFile, moduleText, [
            { name: 'AlibComponent', moduleSpecifier: './alib/alib.component' },
            { name: 'CommonModule', moduleSpecifier: '@angular/common' },
            { name: 'addBuiltInComponents', moduleSpecifier: '@docgeni/template' }
        ]);
    });
});
