import { Injectable } from '@angular/core';
/**
 * @description 测试服务备注
 * @export
 * @class Service1Service
 */
@Injectable()
export class Service1Service {
    property1: string;
    property2: number;
    private property3: string;
    /**
     * 不会获取到
     * @description method1重载方法1
     * @param input1 这是一个参数
     * @memberof Service1Service
     */
    method1(input1: number): void;
    /**
     * 不会获取到
     * @description method1重载方法2
     * @param input1
     * @param input2
     * @memberof Service1Service
     */
    method1(input1: number, input2: number): void;
    method1(input1: number, input2?: number): void {}
    /**
     * method2默认备注
     * @description
     * @return {*} 返回描述测试
     * @memberof Service1Service
     */
    method2(): number {
        return 0;
    }
    private method3() {}
}
