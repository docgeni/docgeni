import ts from 'typescript';
import { lineFeedPrinter } from './line-feed-printer';
import { ArgumentInfo, NgDirectiveMeta, NgDocItemType, NgPropertyKind } from '../types';

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
    return normalizeNodeText(node.getText());
}

export function serializeSymbol(symbol: ts.Symbol, checker: ts.TypeChecker) {
    return {
        name: symbol.getName(),
        documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
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

export function getDirectiveMeta(args: ArgumentInfo[]): NgDirectiveMeta {
    const firstArg = args[0] as Record<string, string | string[]>;
    return firstArg
        ? ({
              selector: firstArg.selector,
              templateUrl: firstArg.templateUrl || null,
              template: firstArg.template || null,
              styleUrls: firstArg.styleUrls || null,
              styles: firstArg.styles || null,
              exportAs: firstArg.exportAs || null
          } as NgDirectiveMeta)
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
