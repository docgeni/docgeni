import { timestamp } from './timestamp';

function isString(value: any): value is string {
    return typeof value === 'string';
}

function isFunction<T>(value: any): value is (...args: any[]) => T {
    return typeof value === 'function';
}

function keyBy<T>(value: Array<T>, key: keyof T): { [key: string]: T } {
    const result: { [key: string]: T } = {};
    (value || []).forEach(item => {
        result[item[`${key}`]] = item;
    });
    return result;
}

export { timestamp, isString, isFunction, keyBy };
