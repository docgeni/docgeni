import { Injectable, TemplateRef } from '@angular/core';

interface ComponentType {}
export abstract class AlibDialogRef<T = unknown, TResult = unknown> {
    instance: T;
    result: TResult;
}

export interface AlibDialogConfig {}

/**
 * Service to open modal dialogs.
 * @export
 * @class AlibDialog
 */
@Injectable()
export class AlibDialog {
    property1: string;
    property2: number;
    private property3: string;

    /** Keeps track of the currently-open dialogs. */
    get openDialogs(): AlibDialogRef[] {
        return [];
    }

    /**
     * Opens a modal dialog containing the given template or component.
     * @param componentOrTemplateRef
     * @param config
     */
    open<T, TData = unknown, TResult = unknown>(
        componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
        config?: AlibDialogConfig
    ): AlibDialogRef<T, TResult> {
        return null;
    }

    /**
     * Closes all of the currently-open dialogs.
     */
    closeAll(): void {}

    /**
     * 不会获取到
     * @description method1重载方法1
     * @param input1 这是一个参数
     * @memberof AlibDialog
     */
    method1(input1: number): void;
    /**
     * 不会获取到
     * @description method1重载方法2
     * @param input1
     * @param input2
     * @memberof AlibDialog
     */
    method1(input1: number, input2: number): void;
    /**
     * 不会获取到
     * @description method1重载方法3
     * @param input1
     * @param input2 注释过长时
     * @memberof AlibDialog
     */
    method1(input1: number, input2: number): void;
    method1(input1: number, input2?: number): void {}
    /**
     * method2默认备注
     * @description
     * @return {*} 返回描述测试
     * @memberof AlibDialog
     */
    method2(): number {
        return 0;
    }
    private method3() {}
}
