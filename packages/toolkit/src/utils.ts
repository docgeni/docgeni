import { timestamp } from './timestamp';

function isString(value: any): value is string {
    return typeof value === 'string';
}

function isFunction<T>(value: any): value is (...args: any[]) => T {
    return typeof value === 'function';
}

export { timestamp, isString, isFunction };
