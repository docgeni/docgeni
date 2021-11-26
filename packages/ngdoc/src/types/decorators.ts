import { NgDirectiveMeta } from './directive';
import { ParsedCallExpressionInfo } from './expression';

export interface NgParsedDecorator extends ParsedCallExpressionInfo {
    isCallExpression: boolean;
}

export type NgParsedDirectiveDecorator = NgParsedDecorator & NgDirectiveMeta;
