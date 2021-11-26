import { createNgSourceFile } from '@docgeni/ngdoc';
import { generateComponentExamplesModule } from './examples-module';

describe('#example-module', () => {
    const sourceText = `
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component.ts';

export default {
    imports: [ CommonModule ],
    declarations: [ AppComponent ],
    providers: [ AppService ]
};
    `;
    const ngSourceFile = createNgSourceFile('module.ts', sourceText);

    function expectOriginalSource(output: string) {
        expect(output).toMatch(`import { AppComponent } from './app.component.ts';`);
        expect(output).toMatch(`import { CommonModule } from '@angular/common';`);
    }

    it('should generate module success with default export', () => {
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component.ts' }];
        const output = generateComponentExamplesModule(ngSourceFile, 'MyButtonExamplesModule', components);
        expectOriginalSource(output);
        expect(output).toMatch(`import { NgModule } from '@angular/core';`);
        expect(output).toMatch(`import { AlibComponent } from './basic.component.ts'`);
        expect(output).toMatch(`export class MyButtonExamplesModule {}`);
        expect(output).toMatch(/declarations: \[ AppComponent, AlibComponent \]/);
        expect(output).toMatch(/providers: \[ AppService \]/);
        expect(output).toMatch(/entryComponents: \[ AlibComponent \]/);
        expect(output).toMatch(/imports: \[ CommonModule \],/);
    });

    it('should generate module success without default export', () => {
        const sourceText = `
        import { CommonModule } from '@angular/common';
        import { AppComponent } from './app.component.ts';
            `;
        const ngSourceFile = createNgSourceFile('module.ts', sourceText);
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component.ts' }];
        const output = generateComponentExamplesModule(ngSourceFile, 'MyButtonExamplesModule', components);
        expectOriginalSource(output);
        expect(output).toMatch(`import { NgModule } from '@angular/core';`);
        expect(output).toMatch(`import { AlibComponent } from './basic.component.ts'`);
        expect(output).toMatch(`export class MyButtonExamplesModule {}`);
        expect(output).toMatch(/declarations: \[ AlibComponent \],/);
        expect(output).toMatch(/providers: \[  \]/);
        expect(output).toMatch(/entryComponents: \[ AlibComponent \]/);
        expect(output).toMatch(/imports: \[  \]/);
    });

    it('should generate module success with empty', () => {
        const ngSourceFile = createNgSourceFile('module.ts', '');
        const components = [{ name: 'AlibComponent', moduleSpecifier: './basic.component.ts' }];
        const output = generateComponentExamplesModule(ngSourceFile, 'MyButtonExamplesModule', components);
        expect(output).toMatch(`import { NgModule } from '@angular/core';`);
        expect(output).toMatch(`import { AlibComponent } from './basic.component.ts'`);
        expect(output).toMatch(`export class MyButtonExamplesModule {}`);
        expect(output).toMatch(/declarations: \[ AlibComponent \],/);
        expect(output).toMatch(/providers: \[  \]/);
        expect(output).toMatch(/entryComponents: \[ AlibComponent \]/);
        expect(output).toMatch(/imports: \[  \]/);
    });

    xit('should generate examples module source for pref', () => {
        const sourceText = `
import { CommonModule } from "@angular/common";
import { NgModule1 } from "@angular/core";

export default {
    imports: [ CommonModule ]
};
`;

        console.time('ngAst');
        const components = [
            { name: 'AlibComponent', moduleSpecifier: './basic.component.ts' },
            { name: 'AlibButtonComponent', moduleSpecifier: './basic.component.ts' },
            { name: 'AlibButtonAdvanceComponent', moduleSpecifier: './advance.component.ts' },
            { name: 'AlibButtonAdvance1Component', moduleSpecifier: './advance1.component.ts' },
            { name: 'AlibButtonAdvance2Component', moduleSpecifier: './advance2.component.ts' },
            { name: 'AlibButtonAdvance3Component', moduleSpecifier: './advance3.component.ts' },
            { name: 'AlibButtonAdvance4Component', moduleSpecifier: './advance4.component.ts' },
            { name: 'AlibButtonAdvance5Component', moduleSpecifier: './advance5.component.ts' },
            { name: 'AlibButtonAdvance6Component', moduleSpecifier: './advance6.component.ts' },
            { name: 'AlibButtonAdvance7Component', moduleSpecifier: './advance7.component.ts' },
            { name: 'AlibButtonAdvance8Component', moduleSpecifier: './advance8.component.ts' },
            { name: 'AlibButtonAdvance9Component', moduleSpecifier: './advance9.component.ts' },
            { name: 'AlibButtonAdvance10Component', moduleSpecifier: './advance10.component.ts' }
        ];

        for (let index = 0; index < 100; index++) {
            const ngSourceFile = createNgSourceFile('module.ts', sourceText);
            const output = generateComponentExamplesModule(ngSourceFile, 'MyButtonExamplesModule', components);
        }
        console.timeEnd('ngAst');
    });
});
