import { ts } from '../typescript';
import { getCallExpressionInfo, parseCallExpressionIdentifiers } from './expression';

export function declarationIsPublic(
    node: ts.PropertyDeclaration | ts.SetAccessorDeclaration | ts.MethodDeclaration | ts.PropertySignature
) {
    return (
        !node.modifiers ||
        !node.modifiers.some(item => item.kind === ts.SyntaxKind.PrivateKeyword || item.kind === ts.SyntaxKind.ProtectedKeyword)
    );
}

export function getSymbolDeclaration(symbol: ts.Symbol): ts.Declaration | null {
    if (!symbol) {
        return null;
    }
    // 如果是类 valueDeclaration 就是类声明
    // 如果是接口，需要通过 getDeclarations 获取第一个节点才是接口声明
    let declaration = symbol.valueDeclaration;
    if (!declaration && symbol.getDeclarations()) {
        declaration = symbol.getDeclarations()[0];
    }
    return declaration;
}

export function getHeritageClauses(declaration: ts.Declaration): ts.HeritageClause[] {
    return (((declaration as ts.ClassDeclaration).heritageClauses || []) as unknown) as ts.HeritageClause[];
}

export function getHeritageDeclarations(declaration: ts.Declaration, checker: ts.TypeChecker): ts.Declaration[] {
    const heritageClauses = getHeritageClauses(declaration);
    const declarations: ts.Declaration[] = [];
    heritageClauses.forEach(node => {
        node.types.forEach(type => {
            const identifiers: ts.Identifier[] = [];
            if (ts.isCallExpression(type.expression)) {
                identifiers.push(...parseCallExpressionIdentifiers(type.expression));
            } else {
                identifiers.push(type.expression as ts.Identifier);
            }
            identifiers.forEach(identifier => {
                const typeLocation = checker.getTypeAtLocation(identifier);
                const declaration = getSymbolDeclaration(typeLocation.symbol);
                if (declaration && (ts.isClassDeclaration(declaration) || ts.isInterfaceDeclaration(declaration))) {
                    declarations.push(declaration);
                }
            });
        });
    });
    return declarations;
}
