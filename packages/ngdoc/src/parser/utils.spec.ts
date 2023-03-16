import { ts } from '../typescript';
import { findNodes, getNodeText, isPublicTag, parseJsDocTagsToDocTagResult } from './utils';

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

    describe('#parseJsDocTagsToDocTagResult', () => {
        it('should parse to tag result', () => {
            const result = parseJsDocTagsToDocTagResult([
                {
                    name: 'public',
                    text: [{ text: '', kind: 'string' }]
                },
                {
                    name: 'order',
                    text: [{ text: '10', kind: 'string' }]
                }
            ]);

            expect(result).toEqual({
                public: { name: 'public', text: [{ text: '', kind: 'string' }] },
                order: { name: 'order', text: [{ text: '10', kind: 'string' }] }
            });
        });
    });

    describe('#isPublicTag', () => {
        it('should get true for public tag', () => {
            const result = isPublicTag({
                public: { name: 'public', text: [] }
            });
            expect(result).toBe(true);
        });

        it('should get true for publicApi tag', () => {
            const result = isPublicTag({
                publicApi: { name: 'publicApi', text: [] }
            });
            expect(result).toBe(true);
        });

        it('should get false when have not publicApi or public tag', () => {
            const result = isPublicTag({
                order: { name: 'order', text: [] }
            });
            expect(result).toBe(false);
        });
    });
});
