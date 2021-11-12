import {
    ArrayLiteralExpression,
    CallExpression,
    Declaration,
    Decorator,
    EmitHint,
    Expression,
    NodeArray,
    ObjectLiteralElementLike,
    ObjectLiteralExpression,
    PropertyAssignment,
    SyntaxKind
} from 'typescript';
import { ArgumentInfo, NgParsedDecorator } from '../types';
import { lineFeedPrinter } from './line-feed-printer';
import { getNodeText, nodeToString } from './utils';

export function getDecorators(declaration: Declaration): NgParsedDecorator[] {
    if (declaration.decorators) {
        return declaration.decorators.map<NgParsedDecorator>(decorator => {
            const callExpression = getCallExpression(decorator);
            if (callExpression) {
                return {
                    argumentInfo: callExpression.arguments.map(argument => parseArgument(argument)),
                    arguments: callExpression.arguments.map(argument =>
                        lineFeedPrinter.printNode(EmitHint.Expression, argument, declaration.getSourceFile())
                    ),
                    expression: decorator as Decorator,
                    isCallExpression: true,
                    name: nodeToString(callExpression.expression)
                };
            } else {
                return {
                    expression: decorator as Decorator,
                    isCallExpression: false,
                    name: nodeToString(decorator.expression)
                };
            }
        });
    }
}

export function getNgDecorator(declaration: Declaration): NgParsedDecorator {
    const decorators = getDecorators(declaration);
    const decorator = decorators
        ? decorators.find(decorator => {
              return ['Directive', 'Component', 'Pipe', 'Injectable'].includes(decorator.name);
          })
        : undefined;
    return decorator;
}

export function getPropertyDecorator(declaration: Declaration) {
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

function getCallExpression(decorator: Decorator) {
    if (decorator.expression.kind === SyntaxKind.CallExpression) {
        return decorator.expression as CallExpression;
    }
}

export function parseProperties(properties: NodeArray<ObjectLiteralElementLike>) {
    const result: ArgumentInfo = {};
    properties.forEach(property => {
        if (property.kind === SyntaxKind.PropertyAssignment) {
            result[nodeToString(property.name!)] = parseArgument((property as PropertyAssignment).initializer);
        }
    });
    return result;
}

export function parseArgument(argument: Expression): ArgumentInfo {
    if (argument.kind === SyntaxKind.ObjectLiteralExpression) {
        return parseProperties((argument as ObjectLiteralExpression).properties);
    }
    if (argument.kind === SyntaxKind.ArrayLiteralExpression) {
        return (argument as ArrayLiteralExpression).elements.map(element => getNodeText(element));
    }
    return getNodeText(argument);
}
