import { createNgSourceFile } from '@docgeni/ngdoc';
import { NgSourceUpdater } from './ng-source-updater';

describe('ng-source-updater', () => {
    const sourceText = `
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

export default {
    imports: [ CommonModule ],
    declarations: [ AppComponent ],
    providers: [ AppService ]
};
        `;

    it('should insert imports', () => {
        const ngSourceFile = createNgSourceFile('module.ts', sourceText);
        const updater = new NgSourceUpdater(ngSourceFile);
        updater.insertImports([
            { name: 'Example', moduleSpecifier: './example' },
            { name: 'Example1', moduleSpecifier: './example1' },
            { name: 'AppRootComponent', moduleSpecifier: './app.component' },
        ]);
        const result = updater.update();
        expect(result).toContain(`import { Example } from './example';`);
        expect(result).toContain(`import { Example1 } from './example1';`);
        expect(result).toContain(`import { AppComponent, AppRootComponent } from './app.component';`);
    });

    it('should remove default export', () => {
        const ngSourceFile = createNgSourceFile('module.ts', sourceText);
        const updater = new NgSourceUpdater(ngSourceFile);
        updater.removeDefaultExport();
        const result = updater.update();
        expect(result).not.toContain(`export default {`);
    });

    it('should insert providers into app config template', () => {
        const appConfigText = `
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DocgeniTemplateModule } from '@docgeni/template';
import { DOCGENI_SITE_PROVIDERS, IMPORT_MODULES } from './content/index';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter([]),
        provideAnimations(),
        importProvidersFrom(DocgeniTemplateModule, ...IMPORT_MODULES),
        ...DOCGENI_SITE_PROVIDERS,
    ],
};
        `;
        const ngSourceFile = createNgSourceFile('app.config.ts', appConfigText);
        const updater = new NgSourceUpdater(ngSourceFile);
        updater.insertProviders(['FormsModule'], 'imports');
        updater.insertProviders(['...myProviders'], 'providers');
        const result = updater.update();
        expect(result).toContain('importProvidersFrom(FormsModule, DocgeniTemplateModule, ...IMPORT_MODULES)');
        expect(result).toContain('...myProviders');
        expect(result).toMatch(/\.\.\.myProviders,\s*\n\s*\.\.\.DOCGENI_SITE_PROVIDERS/);
    });

    it('should insert ngModule by text', () => {
        const ngSourceFile = createNgSourceFile('module.ts', sourceText);
        const updater = new NgSourceUpdater(ngSourceFile);
        const moduleText = `\nexport class AppModule {}`;
        updater.insertNgModuleByText(moduleText);
        const result = updater.update();
        expect(result).toContain(`export class AppModule {}`);
        const moduleIndex = result.indexOf(moduleText);
        const exportDefaultIndex = result.indexOf(`export default {`);
        expect(moduleIndex + moduleText.length).toBeLessThan(exportDefaultIndex);
    });
});
