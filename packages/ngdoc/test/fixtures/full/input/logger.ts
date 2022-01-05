import { Injectable } from '@angular/core';

/**
 * This is logger service
 */
@Injectable()
export class Logger {
    constructor() {}

    /**
     * Log info message
     * @param {string} message message to log
     * @memberof Logger
     */
    info(message: string) {

    }
    /**
     * 不会获取到
     * @description method1重载方法1
     * @param input1 这是一个参数
     * @memberof Logger
     */
    method1(input1: number): void;
    /**
     * 不会获取到
     * @description method1重载方法2
     * @param input1
     * @param input2
     * @memberof Logger
     */
    method1(input1: number, input2: number): void;
    /**
     * 不会获取到
     * @description method1重载方法3
     * @param input1
     * @param input2 注释过长时
     * @memberof Logger
     */
    method1(input1: number, input2: number): void;
    method1(input1: number, input2?: number): void {}
    /**
     * method2默认备注
     * @description
     * @return {*} 返回描述测试
     * @memberof Logger
     */
    method2(): number {
             return 0;
    }
    private method3() {}
}

/**
 * This is ignore service
 */
export class IgnoreClass {}
