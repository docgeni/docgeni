import * as pluralize from 'pluralize';
import camelcase from 'camelcase';
import * as changeCase from 'change-case';
import { titleCase as _titleCase } from 'title-case';
import { paramCase as _paramCase } from 'param-case';

/**
 * Whether plural, 是否是复数
 * @param word word
 */
export function isPlural(word: string) {
    return pluralize.isPlural(word);
}

/**
 * Whether singular, 是否是单数
 * @param word word
 */
export function isSingular(word: string) {
    return pluralize.isSingular(word);
}

export function camelCase(input: string | readonly string[]): string {
    return camelcase(input);
}

export function pascalCase(input: string | readonly string[]): string {
    return camelcase(input, { pascalCase: true });
}

export function titleCase(input: string) {
    return _titleCase(input);
}

export function headerCase(input: string, options?: changeCase.Options) {
    return changeCase.headerCase(input, options);
}

export function snakeCase(input: string, options?: changeCase.Options) {
    return changeCase.snakeCase(input, options);
}

export function paramCase(input: string, options?: changeCase.Options) {
    return _paramCase(input, options);
}

export function isString(value: any): value is string {
    return typeof value === 'string';
}

export function generateRandomId(length = 32): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function compatibleNormalize(input: string) {
    return input
        .replace(/\r\n|\r/g, '\n')
        .replace(/\t/g, '    ')
        .trim();
}
