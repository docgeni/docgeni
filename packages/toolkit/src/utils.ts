import { timestamp } from './timestamp';
import path from 'path';
import minimatch from 'minimatch';
import _ from 'lodash';

export function isString(value: any): value is string {
    return typeof value === 'string';
}

export function isNumber(value: any): value is number {
    return typeof value === 'number';
}

export function isFunction<T>(value: any): value is (...args: any[]) => T {
    return typeof value === 'function';
}

export function isArray<T>(value: any): value is Array<T> {
    return Array.isArray(value);
}

export function isEmpty(value: any): boolean {
    if (value) {
        return isArray(value) ? value.length === 0 : false;
    } else {
        return true;
    }
}

export function isUndefinedOrNull(value: any) {
    return value === undefined || value === null;
}

export function keyBy<T>(value: Array<T>, key: keyof T): { [key: string]: T } {
    const result: { [key: string]: T } = {};
    (value || []).forEach(item => {
        result[item[`${key}`]] = item;
    });
    return result;
}

export function sortByOrderMap<T extends object>(items: T[], ordersMap: WeakMap<T, number>): T[] {
    return items.sort((a, b) => {
        const aOrder = isNumber(ordersMap.get(a)) ? ordersMap.get(a) : Number.MAX_SAFE_INTEGER;
        const bOrder = isNumber(ordersMap.get(b)) ? ordersMap.get(b) : Number.MAX_SAFE_INTEGER;
        return aOrder > bOrder ? 1 : aOrder === bOrder ? 0 : -1;
    });
}

export function extractExtname(p: string, removeDot = false) {
    const extname = path.extname(p);
    return removeDot ? extname.replace('.', '') : extname;
}

export function matchGlob(target: string, pattern: string | string[], options?: minimatch.IOptions): boolean {
    if (isArray(pattern)) {
        return !!pattern.find(item => {
            return minimatch(target, item, options);
        });
    } else {
        return minimatch(target, pattern, options);
    }
}

export function coerceArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

export function random(lower: number = 0, upper: number = 1, floating: boolean = false): number {
    return _.random(lower, upper, floating);
}

export function sample<T>(collection: T[]): T {
    return _.sample(collection);
}

export function uniq<T>(collection: _.List<T>): T[] {
    return _.uniq(collection);
}

export function some<T>(collection: _.List<T>, predicate: _.ListIterateeCustom<T, boolean>): boolean {
    return _.some(collection, predicate);
}

export function wait(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => {
        // eslint-disable-next-line no-restricted-globals
        setTimeout(() => {
            return resolve();
        }, milliseconds);
    });
}

export * from './path';

export { timestamp };
