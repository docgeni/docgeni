import ts from 'typescript';
import { toolkit } from '@docgeni/toolkit';
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

export function getPropertyOptions(node: ts.PropertyDeclaration): (string | number)[] | null {
    if (typeof node.type === 'undefined') return null;

    if (ts.isUnionTypeNode(node.type)) {
        const typesNode: ts.NodeArray<ts.TypeNode> = node.type.types;
        if (!typesNode.some(ts.isLiteralTypeNode)) return null;

        return typesNode.map((node: ts.TypeNode) => {
            if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
                return getNodeText(node);
            }

            if (ts.isLiteralTypeNode(node) && ts.SyntaxKind.FirstLiteralToken === node.literal.kind) {
                return parseInt(node.getText(), 10);
            }

            return getNodeText(node);
        });
    }

    return null;
}

export function getPropertyValue(node: ts.PropertyDeclaration, type: string | null): string | number | boolean | null {
    if (!node.initializer) return null;

    const value = node.initializer!.getText();

    if (!type) return normalizeNodeText(value);

    switch (type.toLowerCase()) {
        case 'number': {
            return parseInt(value, 10);
        }
        case 'boolean': {
            return value === 'true' ? true : false;
        }
        default: {
            return normalizeNodeText(value);
        }
    }
}

export function getPropertyKind(name: string): NgPropertyKind {
    return toolkit.strings.camelCase(name) as NgPropertyKind;
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
