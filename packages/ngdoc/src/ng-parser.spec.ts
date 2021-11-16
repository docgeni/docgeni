import { NgDocParser } from '../src';
import * as path from 'path';
import { toolkit } from '@docgeni/toolkit';
// import ts from 'typescript';
import { Project, Node, ts } from 'ts-morph';

const EXCLUDE_DIRS = [];
const ONLY_TEST_FIXTURE = '';

function objectContaining<T>(object: T) {
    if (toolkit.utils.isArray(object)) {
        return jasmine.arrayContaining(
            object.map(item => {
                return objectContaining(item);
            })
        );
    } else if (typeof object === 'object') {
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const element = object[key];
                if (toolkit.utils.isArray(element) || typeof element === 'object') {
                    object[key] = objectContaining(element);
                }
            }
        }
        return jasmine.objectContaining(object);
    } else {
        return object;
    }
}

function testAllFixtures() {
    const root = path.resolve(__dirname, '../test/fixtures');
    const dirs = toolkit.fs.readdirSync(root);
    for (const dir of dirs) {
        if (ONLY_TEST_FIXTURE && ONLY_TEST_FIXTURE !== dir) {
            continue;
        }
        if (!EXCLUDE_DIRS.includes(dir)) {
            it(`should parse success for case: ${dir}`, async () => {
                const input = path.resolve(root, `${dir}/input/*.ts`);
                const outputPath = path.resolve(root, `${dir}/output.json`);
                const output = toolkit.fs.readJSONSync(outputPath);
                const docs = NgDocParser.parse(input);
                // console.log(JSON.stringify(docs, null, 2));
                expect(docs).toEqual(objectContaining(output));
            });
        }
    }
}

describe('#parser', () => {
    testAllFixtures();

    // it('perf compare', () => {
    //     const root = path.resolve(__dirname, '../test/fixtures');
    //     const input = path.resolve(root, `full/input/*.ts`);
    //     const filePaths = toolkit.fs.globSync(input);
    //     console.time('createProgram');
    //     const program = ts.createProgram(filePaths, { skipLibCheck: true, skipDefaultLibCheck: true }, undefined, undefined, []);
    //     console.log(`program getSourceFiles: ${program.getSourceFiles().length}`);
    //     console.timeEnd('createProgram');

    //     console.time('createProgram1');
    //     const program1 = ts.createProgram(filePaths, { skipLibCheck: true, skipDefaultLibCheck: true }, undefined, program);
    //     console.timeEnd('createProgram1');

    //     console.time('tsMorph');
    //     const project = new Project({});
    //     project.addSourceFilesAtPaths(input);
    //     console.log(`project getSourceFiles: ${project.getSourceFiles().length}`);
    //     const d1 = project.getProgram().compilerObject; //.getTypeChecker().compilerObject;
    //     console.timeEnd('tsMorph');

    //     console.time('tsMorph1');
    //     const project2 = new Project({});
    //     project2.addSourceFilesAtPaths(path.resolve(root, `property-ref-enum/input/*.ts`));
    //     console.log(`project getSourceFiles: ${project2.getSourceFiles().length}`);
    //     const d3 = project2.getProgram().compilerObject; //.getTypeChecker().compilerObject;
    //     console.timeEnd('tsMorph1');

    //     // console.log(p.getSourceFiles().length);
    //     // project.getSourceFiles().forEach(sourceFile => {
    //     //     // console.log(sourceFile.getExportedDeclarations());
    //     //     const classDeclarations = sourceFile.getClasses().filter(item => {
    //     //         return item.isExported();
    //     //     });
    //     //     classDeclarations.forEach(classDeclaration => {
    //     //         const ngDecorator = classDeclaration.getDecorators().find(decorator => {
    //     //             return ['Component', 'Directive', 'Injectable'].includes(decorator.getName());
    //     //         });
    //     //         if (ngDecorator) {
    //     //             const args = ngDecorator.getArguments();
    //     //             console.log(`${ngDecorator.getName()} getArguments: ${args[0] ? args[0].print() : 'none'}`);
    //     //             if (args[0] && Node.isObjectLiteralExpression(args[0])) {
    //     //                 const properties = args[0].getProperties();
    //     //                 const values = properties.map(property => {
    //     //                     if (Node.isPropertyAssignment(property)) {
    //     //                         return {
    //     //                             [property.compilerNode.name.getText()]: property.getInitializer().getText()
    //     //                         };
    //     //                     }
    //     //                 });
    //     //                 console.log(values);
    //     //             }
    //     //             classDeclaration.forEachChild(node => {
    //     //                 if (Node.isPropertyDeclaration(node)) {
    //     //                     const pDecorator = node.getDecorators().find(decorator => {
    //     //                         return ['Input', 'Output'].includes(decorator.getName());
    //     //                     });
    //     //                     if (pDecorator) {
    //     //                         console.log(`isPropertyDeclaration: ${node.getText()}`);
    //     //                         const args = pDecorator.getArguments();
    //     //                         const unionTypes = node.getType().getUnionTypes();
    //     //                         const typeName = project.getTypeChecker().getTypeText(node.getType(), undefined, ts.TypeFormatFlags.None);
    //     //                         console.log(
    //     //                             `type: ${typeName}, ${unionTypes.map(unionType => {
    //     //                                 return unionType.getLiteralValue().toString();
    //     //                             })}`
    //     //                         );
    //     //                     }
    //     //                 }
    //     //             });
    //     //             const typeChecker = project.getTypeChecker();
    //     //             const symbol = typeChecker.getSymbolAtLocation(classDeclaration);
    //     //             console.log(symbol);
    //     //             // const type = typeChecker.getTypeOfSymbolAtLocation(symbol, symbol.getValueDeclaration());
    //     //             // console.log(`Text: ${type.getText()}`);
    //     //             const comments = classDeclaration.getLeadingCommentRanges();
    //     //             console.log(classDeclaration.getJsDocs().map(item => item.getComment()));
    //     //         }
    //     //     });
    //     // });
    // });

    it('should get exports components', () => {
        const source = `
        @Component({selector: "my-component"})
        export class MyComponent {}

        export class NotComponent {}

        @Component({selector: "internal-component"})
        class InternalComponent {}
        `;
        const result = NgDocParser.getExportsComponents(source);
        expect(result).toEqual([jasmine.objectContaining({ name: 'MyComponent', selector: 'my-component' })]);
    });
});
