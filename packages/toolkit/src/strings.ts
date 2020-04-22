import * as pluralize from 'pluralize';
import camelcase from 'camelcase';
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

export function camelCase(input: string | readonly string[], options?: camelcase.Options): string {
    return camelcase(input, options);
}

export function pascalCase(input: string | readonly string[]): string {
    return camelcase(input, { pascalCase: true });
}
