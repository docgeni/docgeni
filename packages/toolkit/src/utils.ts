import { timestamp } from './timestamp';
import * as path from 'path';

export function isString(value: any): value is string {
    return typeof value === 'string';
}

export function isNumber(value: any): value is number {
    return typeof value === 'number';
}

export function isFunction<T>(value: any): value is (...args: any[]) => T {
    return typeof value === 'function';
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
        const aOrder = ordersMap.get(a);
        const bOrder = ordersMap.get(b);
        return aOrder > bOrder ? 1 : aOrder === bOrder ? 0 : -1;
    });
}

export function extractExtname(p: string, removeDot = false) {
    const extname = path.extname(p);
    return removeDot ? extname.replace('.', '') : extname;
}

export { timestamp };
