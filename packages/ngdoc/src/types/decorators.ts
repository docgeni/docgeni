import { NgDirectiveMeta } from './directive';

export type ArgumentInfo = string | string[] | { [key: string]: ArgumentInfo };

export interface NgParsedDecorator {
    argumentInfo?: ArgumentInfo[];
    arguments?: string[];
    isCallExpression: boolean;
    name: string;
}

export type NgParsedDirectiveDecorator = NgParsedDecorator & NgDirectiveMeta;
