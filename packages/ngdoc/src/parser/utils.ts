import { ArgumentInfo, NgDirectiveMetadata, NgDocItemType } from '../types';
import { ts } from '../typescript';
import { lineFeedPrinter } from './line-feed-printer';

/**
 * Use a preconfigured TypeScript "printer" to render the text of a node, without comments.
 */
export function nodeToString(typeNode: ts.Node) {
    return lineFeedPrinter.printNode(ts.EmitHint.Unspecified, typeNode, typeNode.getSourceFile());
}

export function normalizeNodeText(text: string) {
    return text.replace(/"|'/g, '');
}

export function getNodeText(node: ts.Node) {
    if (ts.isStringLiteral(node)) {
        return node.text;
    } else if (ts.isCallExpression(node)) {
        return node.getText();
    } else {
        return normalizeNodeText(node.getText());
    }
}

export function serializeSymbol(symbol: ts.Symbol, checker: ts.TypeChecker) {
    return {
        name: symbol.getName(),
        description: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
        type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!))
    };
}

export function getNgDocItemType(name: string): NgDocItemType {
    return {
        Component: 'component',
        Directive: 'directive',
        Injectable: 'service',
        Pipe: 'pipe',
        Interface: 'interface'
    }[name] as NgDocItemType;
}

export function getDirectiveMeta(args: ArgumentInfo[]): NgDirectiveMetadata {
    const firstArg = args[0] as Record<string, string | string[]>;
    return firstArg
        ? ({
              selector: firstArg.selector,
              templateUrl: firstArg.templateUrl || null,
              template: firstArg.template || null,
              styleUrls: firstArg.styleUrls || null,
              styles: firstArg.styles || null,
              exportAs: firstArg.exportAs || null,
              standalone: firstArg.standalone === 'true'
          } as NgDirectiveMetadata)
        : undefined;
}

export function getTypeNodes(typeNodes: ts.NodeArray<ts.TypeNode>) {
    if (!typeNodes.some(ts.isLiteralTypeNode)) return null;

    return typeNodes.map((node: ts.TypeNode) => {
        if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
            return getNodeText(node);
        }

        if (ts.isLiteralTypeNode(node) && ts.SyntaxKind.FirstLiteralToken === node.literal.kind) {
            return parseInt(node.getText(), 10);
        }

        return getNodeText(node);
    });
}

export function isExported<TNode extends ts.Node>(node: TNode): node is TNode {
    return ts.canHaveModifiers(node) && ts.getModifiers(node)
        ? !!ts.getModifiers(node).find(modifier => {
              return ts.SyntaxKind.ExportKeyword === modifier.kind;
          })
        : false;
}

export function isExportedClassDeclaration(node: ts.Node): node is ts.ClassDeclaration {
    return ts.isClassDeclaration(node) && isExported(node);
}

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param max The maximum number of items to return.
 * @param recursive Continue looking for nodes of kind recursive until end
 * the last child even when node of kind has been found.
 * @return all nodes of kind, or [] if none is found
 */
export function findNodes(node: ts.Node, kind: ts.SyntaxKind, max?: number, recursive?: boolean): ts.Node[];
/**
 * Find all nodes from the AST in the subtree that satisfy a type guard.
 * @param node
 * @param guard
 * @param max The maximum number of items to return.
 * @param recursive Continue looking for nodes of kind recursive until end
 * the last child even when node of kind has been found.
 * @return all nodes that satisfy the type guard, or [] if none is found
 */
export function findNodes<T extends ts.Node>(node: ts.Node, guard: (node: ts.Node) => node is T, max?: number, recursive?: boolean): T[];
export function findNodes<T extends ts.Node>(
    node: ts.Node,
    kindOrGuard: ts.SyntaxKind | ((node: ts.Node) => node is T),
    max = Infinity,
    recursive = false
): T[] {
    if (!node || max === 0) {
        return [];
    }

    const test = typeof kindOrGuard === 'function' ? kindOrGuard : (node: ts.Node): node is T => node.kind === kindOrGuard;

    const arr: T[] = [];
    if (test(node)) {
        arr.push(node);
        max--;
    }
    if (max > 0 && (recursive || !test(node))) {
        for (const child of node.getChildren()) {
            findNodes(child, test, max, recursive).forEach(node => {
                if (max > 0) {
                    arr.push(node);
                }
                max--;
            });

            if (max <= 0) {
                break;
            }
        }
    }

    return arr;
}

// export function findNode(node: ts.Node, kind: ts.SyntaxKind, text: string): ts.Node | null {
//     if (node.kind === kind && node.getText() === text) {
//         return node;
//     }

//     let foundNode: ts.Node | null = null;
//     ts.forEachChild(node, childNode => {
//         foundNode = foundNode || findNode(childNode, kind, text);
//     });

//     return foundNode;
// }

/**
 * Get all the nodes from a source.
 * @param sourceFile The source file object.
 * @returns {Array<ts.Node>} An array of all the nodes in the source.
 */
// export function getSourceNodes(sourceFile: ts.SourceFile, maxLevel = 1): ts.Node[] {
//     const nodes: ts.Node[] = [sourceFile];
//     const result = [];

//     while (nodes.length > 0) {
//         const node = nodes.shift();

//         if (node) {
//             result.push(node);
//             if (node.getChildCount(sourceFile) >= 0) {
//                 nodes.unshift(...node.getChildren());
//             }
//         }
//     }

//     return result;
// }

export interface DocTagResult {
    description?: ts.JSDocTagInfo;
    default?: ts.JSDocTagInfo;
    deprecated?: ts.JSDocTagInfo;
    name?: ts.JSDocTagInfo;
    type?: ts.JSDocTagInfo;
    order?: ts.JSDocTagInfo;
    // param?: Record<string, ts.JSDocTagInfo>;
    [key: string]: ts.JSDocTagInfo;
}
export interface MethodDocTagResult {
    description?: ts.JSDocTagInfo;
    default?: ts.JSDocTagInfo;
    deprecated?: ts.JSDocTagInfo;
    return?: ts.JSDocTagInfo;
    param?: Record<string, ts.JSDocTagInfo>;
}

export function getDocTagsBySymbol(symbol: ts.Symbol): [DocTagResult, Record<string, DocTagResult>] {
    return parseJsDocTagsToDocTagResult(symbol.getJsDocTags());
}

export function parseJsDocTagsToDocTagResult(tags: (ts.JSDocTagInfo | undefined)[]): [DocTagResult, Record<string, DocTagResult>] {
    const defaultLocaleTags: DocTagResult = {};
    const localeTags: Record<string, DocTagResult> = {};
    tags.forEach(jsDocTag => {
        if (jsDocTag.text && jsDocTag.text[0] && jsDocTag.text[0].text && jsDocTag.text[0].text.startsWith('.')) {
            const locale = jsDocTag.text[0].text.substring(1, jsDocTag.text[0].text.indexOf(' '));
            jsDocTag.text[0].text = jsDocTag.text[0].text.replace(`.${locale}`, '').trim();
            if (locale) {
                if (!localeTags[locale]) {
                    localeTags[locale] = {};
                }
                localeTags[locale][jsDocTag.name] = jsDocTag;
            }
        } else {
            if (jsDocTag.name === 'param') {
                const paramName = jsDocTag.text[0].text;
                const paramDesc = jsDocTag.text.length >= 3 ? jsDocTag.text[2].text : '';

                defaultLocaleTags[jsDocTag.name] = defaultLocaleTags[jsDocTag.name] || (({} as unknown) as ts.JSDocTagInfo);
                defaultLocaleTags[jsDocTag.name][paramName] = { name: paramName, text: [{ text: paramDesc, kind: 'text' }] };
            } else {
                defaultLocaleTags[jsDocTag.name] = jsDocTag;
            }
        }
    });
    return [defaultLocaleTags, localeTags];
}

export function getTextByJSDocTagInfo(tag: ts.JSDocTagInfo, defaultValue: string) {
    return ts.displayPartsToString(tag && tag.text) || defaultValue;
}

/**
 *  标记为 private 或者 internal 的 Tag
 */
export function hasPrivateTag(tags: DocTagResult) {
    return !!(tags.private || tags.internal);
}

/**
 * 标记为公开的 Tag
 */
export function hasPublicTag(tags: DocTagResult) {
    return !!(tags.publicApi || tags.public);
}

export function getDocTagsBySignature(symbol: ts.Signature): MethodDocTagResult {
    const tags = symbol.getJsDocTags();
    return tags.reduce((result, item) => {
        if (item.name !== 'param') {
            result[item.name] = item;
        } else {
            let paramName: string;
            let paramText: string;
            const regexpResult = (ts.displayPartsToString(item.text) || '').match(/(^\S+)\s?(.*)$/);
            if (regexpResult) {
                paramText = regexpResult[2] || '';
                paramName = regexpResult[1];
            } else {
                throw new Error(`[${item.name}-${item.text}]param comment format error`);
            }
            result[item.name] = result[item.name] || {};
            result[item.name][paramName] = { ...item, text: paramText };
        }
        return result;
    }, {});
}

export function serializeMethodParameterSymbol(symbol: ts.Symbol, checker: ts.TypeChecker, tags: MethodDocTagResult) {
    const result = serializeSymbol(symbol, checker);
    result.description = getTextByJSDocTagInfo((tags.param || {})[result.name], result.description);
    return result;
}
