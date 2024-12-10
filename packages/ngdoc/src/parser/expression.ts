import { ArgumentInfo, NgParsedDecorator } from '../types';
import { ts } from '../typescript';
import { lineFeedPrinter } from './line-feed-printer';
import { getNodeText, nodeToString } from './utils';

export function getCallExpressionInfo(callExpression: ts.CallExpression) {
    return {
        argumentInfo: callExpression.arguments.map((argument) => parseArgument(argument)),
        arguments: callExpression.arguments.map((argument) => {
            return lineFeedPrinter.printNode(ts.EmitHint.Expression, argument, callExpression.getSourceFile());
        }),
        expression: callExpression,
        isCallExpression: true,
        name: nodeToString(callExpression.expression),
    };
}

export function getObjectLiteralExpressionProperties(expression: ts.ObjectLiteralExpression): ArgumentInfo {
    return expression && expression.properties ? parseProperties(expression.properties) : undefined;
}

export function parseProperties(properties: ts.NodeArray<ts.ObjectLiteralElementLike>): ArgumentInfo {
    const result: ArgumentInfo = {};
    properties.forEach((property) => {
        if (property.kind === ts.SyntaxKind.PropertyAssignment) {
            result[nodeToString(property.name!)] = parseArgument((property as ts.PropertyAssignment).initializer);
        }
    });
    return result;
}

export function parseArgument(argument: ts.Expression): ArgumentInfo {
    if (ts.isObjectLiteralExpression(argument)) {
        return parseProperties((argument as ts.ObjectLiteralExpression).properties);
    }
    if (ts.isArrayLiteralExpression(argument)) {
        return (argument as ts.ArrayLiteralExpression).elements.map((element) => {
            return getNodeText(element);
        });
    }
    return getNodeText(argument);
}

export function parseCallExpressionIdentifiers(expression: ts.Expression): ts.Identifier[] {
    if (ts.isCallExpression(expression)) {
        const identifiers: ts.Identifier[] = [];
        expression.arguments.map((argument) => {
            identifiers.push(...parseCallExpressionIdentifiers(argument));
        });
        return identifiers;
    } else if (ts.isIdentifier(expression)) {
        return [expression];
    } else {
        return [];
    }
}
