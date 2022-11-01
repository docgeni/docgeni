import { ts } from '../typescript';
import { getNodeText } from './utils';

describe('#utils', () => {
    describe('#getNodeText', () => {
        it('should normalize node text success', () => {
            const sourceFile = ts.createSourceFile('test.ts', `@call({name: "hello"}) class A {}`, ts.ScriptTarget.ES2015, true);
            const visit = (node: ts.Node) => {
                if (ts.isPropertyAssignment(node)) {
                    expect(node.initializer.getText()).toEqual('"hello"');
                    expect(getNodeText(node.initializer)).toEqual('hello');
                }
                ts.forEachChild(node, visit);
            };
            visit(sourceFile);
        });

        it('should normalize node text for callExpression', () => {
            const sourceFile = ts.createSourceFile('test.ts', `@call({name: book(1, a, "2")}) class A {}`, ts.ScriptTarget.ES2015, true);
            const visit = (node: ts.Node) => {
                if (ts.isPropertyAssignment(node)) {
                    expect(node.initializer.getText()).toEqual('book(1, a, "2")');
                    expect(getNodeText(node.initializer)).toEqual('book(1, a, "2")');
                }
                ts.forEachChild(node, visit);
            };
            visit(sourceFile);
        });
    });
});
