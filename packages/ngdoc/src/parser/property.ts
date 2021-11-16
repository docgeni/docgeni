import { ts } from '../typescript';
import { NgPropertyKind } from '../types';
import { getNodeText, getTypeNodes, normalizeNodeText } from './utils';
import { toolkit } from '@docgeni/toolkit';

export function getPropertyType(node: ts.PropertyDeclaration): string | null {
    if (typeof node.type === 'undefined') return null;

    switch (node.type.kind) {
        case ts.SyntaxKind.TypeReference:
            return node.type.getText();
        case ts.SyntaxKind.UnionType:
            const unionNode: ts.UnionTypeNode = <ts.UnionTypeNode>node.type;
            const types: ts.NodeArray<ts.TypeNode> = unionNode.types;

            return types.reduce((type, typeNode: ts.TypeNode, count: number) => {
                if (ts.isLiteralTypeNode(typeNode) && ts.isStringLiteral(typeNode.literal)) {
                    return type === 'string' || count === 0 ? 'string' : 'any';
                }

                if (ts.isLiteralTypeNode(typeNode) && ts.SyntaxKind.FirstLiteralToken === typeNode.literal.kind) {
                    return type === 'number' || count === 0 ? 'number' : 'any';
                }

                return type === typeNode.getText() || count === 0 ? typeNode.getText() : 'any';
            }, 'string');
    }

    return node.type.getText();
}

export function getNgPropertyOptions(node: ts.PropertyDeclaration, checker?: ts.TypeChecker): (string | number)[] | null {
    if (typeof node.type === 'undefined') return null;

    if (ts.isUnionTypeNode(node.type)) {
        const typeNodes: ts.NodeArray<ts.TypeNode> = node.type.types;
        return getTypeNodes(typeNodes);
    } else if (ts.isTypeReferenceNode(node.type)) {
        const type = checker.getTypeAtLocation(node.type);
        if (type.isUnion()) {
            return type.types.map(type => {
                return normalizeNodeText(checker.typeToString(type));
            });
        }
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
