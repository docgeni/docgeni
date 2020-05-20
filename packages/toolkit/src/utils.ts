import { timestamp } from './timestamp';

function isString(value: any): value is string {
    return typeof value === 'string';
}

function isNumber(value: any): value is number {
    return typeof value === 'number';
}

function isFunction<T>(value: any): value is (...args: any[]) => T {
    return typeof value === 'function';
}

function isUndefinedOrNull(value: any) {
    return value === undefined || value == null;
}

function keyBy<T>(value: Array<T>, key: keyof T): { [key: string]: T } {
    const result: { [key: string]: T } = {};
    (value || []).forEach(item => {
        result[item[`${key}`]] = item;
    });
    return result;
}

function sortByOrderMap<T extends object>(items: T[], ordersMap: WeakMap<T, number>): T[] {
    return items.sort((a, b) => {
        const aOrder = ordersMap.get(a);
        const bOrder = ordersMap.get(b);
        return aOrder > bOrder ? 1 : aOrder === bOrder ? 0 : -1;
    });
}

export { timestamp, isString, isNumber, isFunction, isUndefinedOrNull, keyBy, sortByOrderMap };
