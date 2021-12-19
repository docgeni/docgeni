import { ts } from '../typescript';
import { ArgumentInfo, NgParsedDecorator } from '../types';
import { getNodeText, nodeToString } from './utils';
import { getCallExpressionInfo } from './expression';

export function getDecorators(declaration: ts.Declaration): NgParsedDecorator[] {
    if (declaration.decorators) {
        return declaration.decorators.map<NgParsedDecorator>(decorator => {
            const callExpression = getCallExpression(decorator);
            if (callExpression) {
                return getCallExpressionInfo(callExpression);
            } else {
                return {
                    expression: decorator as ts.Decorator,
                    isCallExpression: false,
                    name: nodeToString(decorator.expression)
                };
            }
        });
    }
}

export function getNgDecorator(
    declaration: ts.Declaration,
    decoratorNames: string[] = ['Component', 'Directive', 'Pipe', 'Injectable']
): NgParsedDecorator {
    const decorators = getDecorators(declaration);
    const decorator = decorators
        ? decorators.find(decorator => {
              return decoratorNames.includes(decorator.name);
          })
        : undefined;
    return decorator;
}

export function getNgPropertyDecorator(declaration: ts.Declaration) {
    const decorators = getDecorators(declaration);
    const decorator = decorators
        ? decorators.find(decorator => {
              return ['Input', 'Output', 'ContentChild', 'ContentChildren'].includes(decorator.name);
          })
        : undefined;

    if (decorator) {
        const argument: Record<string, string> = decorator.argumentInfo[0] as Record<string, string>;
        return {
            ...decorator,
            ...argument
        };
    }
    return decorator;
}

function getCallExpression(decorator: ts.Decorator) {
    if (decorator.expression.kind === ts.SyntaxKind.CallExpression) {
        return decorator.expression as ts.CallExpression;
    }
}
