import * as pluralize from 'pluralize';
import camelcase from 'camelcase';
import * as changeCase from 'change-case';
import { titleCase as _titleCase } from 'title-case';

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

export function isString(value: any): value is string {
    return typeof value === 'string';
}
