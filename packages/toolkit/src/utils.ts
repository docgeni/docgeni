import { timestamp } from './timestamp';
import * as path from 'path';
import minimatch from 'minimatch';

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
    return value === undefined || value == null;
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

export { timestamp };
