// import * as ts from 'typescript';
// import { toolkit } from '@docgeni/toolkit';
// import * as path from 'path';
// import { of as observableOf } from 'rxjs';
// import {
//     Tree,
//     HostTree,
//     SchematicDescription,
//     Rule,
//     MergeStrategy,
//     Engine,
//     Schematic,
//     CollectionDescription,
//     SchematicImpl,
//     SchematicContext
// } from '@angular-devkit/schematics';
// import { branch, empty } from '@angular-devkit/schematics/src/tree/static';
// import { logging } from '@angular-devkit/core';

// type CollectionT = {
//     description: string;
// };
// type SchematicT = {
//     collection: CollectionT;
//     description: string;
//     path: string;
//     factory: <T>(options: T) => Rule;
// };

// function files(tree: Tree) {
//     const files: string[] = [];
//     tree.visit(x => files.push(x));
//     return files;
// }

// const context = {
//     debug: false,
//     logger: new logging.NullLogger(),
//     strategy: MergeStrategy.Default
// };
// const engine: Engine<CollectionT, SchematicT> = ({
//     createContext: (schematic: Schematic<{}, {}>) => {
//         return { engine, schematic, ...context };
//     },
//     transformOptions: (_: {}, options: {}) => {
//         return observableOf(options);
//     },
//     defaultMergeStrategy: MergeStrategy.Default
// } as {}) as Engine<CollectionT, SchematicT>;
// const collection = {
//     name: 'collection',
//     description: 'description'
// } as CollectionDescription<CollectionT>;

// fdescribe('typescript source', () => {
//     it('', async () => {
//         let inner: Tree | null = null;
//         const desc: SchematicDescription<CollectionT, SchematicT> = {
//             collection,
//             name: 'test',
//             description: '',
//             path: '/a/b/c',
//             factory: () => (tree: Tree, ctx: SchematicContext) => {
//                 inner = tree.branch();
//                 tree.create('a/b/c', 'some content');
//                 tree.create('a.txt', 'some content');

//                 console.log(ctx);
//                 return tree;
//             }
//         };

//         const schematic = new SchematicImpl(desc, desc.factory, null!, engine);
//         schematic
//             .call({}, observableOf(empty()) as any)
//             .toPromise()
//             .then(x => {
//                 // console.log(x.root);
//                 console.log(files(x));
//                 console.log(x.get('a.txt').content.toString());
//                 expect(files(inner!)).toEqual([]);
//                 // expect(files(x)).toEqual(['/a/b/c']);
//             })
//             .then(() => {});
//         // const content = await toolkit.fs.readFileContent(path.resolve(__dirname, './example.ts'));
//         // const sourceFile = ts.createSourceFile('./example.ts', content, ts.ScriptTarget.ES2020);
//         // sourceFile.forEachChild(node => {
//         //     console.log(`Kind: ${node.kind}, start-end: ${node}-${node.end}`);;
//         //     console.log(node.getText(sourceFile));
//         // });
//     });
// });
