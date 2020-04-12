import * as pluralize from 'pluralize';

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
