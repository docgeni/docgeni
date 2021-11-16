import { createNgSourceFile, NgSourceFile } from './ng-source-file';
import path from 'path';

describe('#ng-source-file', () => {
    it('should create ng source file success by sourceText', () => {
        const ngSourceFile = createNgSourceFile('test.ts', `sourceText`);
        expect(ngSourceFile).toBeTruthy();
        expect(ngSourceFile.origin).toBeTruthy();
    });

    it('should create ng source file success by filePath', () => {
        const ngSourceFile = createNgSourceFile(path.resolve(__dirname, '../test/fixtures/full/input/button.component.ts'));
        expect(ngSourceFile).toBeTruthy();
        expect(ngSourceFile.origin).toBeTruthy();
    });

    it('should get exported components', () => {
        const sourceText = `
        @Component({selector: "my-component"})
        export class MyComponent {}

        export class NotComponent {}

        @Component({selector: "internal-component"})
        class InternalComponent {}
        `;
        const ngSourceFile = createNgSourceFile('test.ts', sourceText);
        expect(ngSourceFile.getExportedComponents()).toEqual([jasmine.objectContaining({ name: 'MyComponent', selector: 'my-component' })]);
    });
});
