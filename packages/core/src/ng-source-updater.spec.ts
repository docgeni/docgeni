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
            { name: 'AppRootComponent', moduleSpecifier: './app.component' }
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
