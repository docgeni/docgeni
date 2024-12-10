import { ts } from '../typescript';
import { findNodes, getNodeText, hasPublicTag, parseJsDocTagsToDocTagResult } from './utils';

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
                    text: [{ text: '', kind: 'string' }],
                },
                {
                    name: 'order',
                    text: [{ text: '10', kind: 'string' }],
                },
            ]);

            expect(result).toEqual([
                {
                    public: { name: 'public', text: [{ text: '', kind: 'string' }] },
                    order: { name: 'order', text: [{ text: '10', kind: 'string' }] },
                },
                {},
            ]);
        });

        it('should parse to tag result for multi-locals', () => {
            const result = parseJsDocTagsToDocTagResult([
                {
                    name: 'description',
                    text: [{ text: 'default description', kind: 'string' }],
                },
                {
                    name: 'description',
                    text: [{ text: '.zh-cn zh cn description', kind: 'string' }],
                },
                {
                    name: 'name',
                    text: [{ text: 'my name', kind: 'string' }],
                },
                {
                    name: 'name',
                    text: [{ text: '.zh-cn zh cn name', kind: 'string' }],
                },
            ]);

            expect(result).toEqual([
                {
                    description: { name: 'description', text: [{ text: 'default description', kind: 'string' }] },
                    name: { name: 'name', text: [{ text: 'my name', kind: 'string' }] },
                },
                {
                    'zh-cn': {
                        description: { name: 'description', text: [{ text: 'zh cn description', kind: 'string' }] },
                        name: { name: 'name', text: [{ text: 'zh cn name', kind: 'string' }] },
                    },
                },
            ]);
        });
    });

    describe('#hasPublicTag', () => {
        it('should get true for public tag', () => {
            const result = hasPublicTag({
                public: { name: 'public', text: [] },
            });
            expect(result).toBe(true);
        });

        it('should get true for publicApi tag', () => {
            const result = hasPublicTag({
                publicApi: { name: 'publicApi', text: [] },
            });
            expect(result).toBe(true);
        });

        it('should get false when have not publicApi or public tag', () => {
            const result = hasPublicTag({
                order: { name: 'order', text: [] },
            });
            expect(result).toBe(false);
        });
    });
});
