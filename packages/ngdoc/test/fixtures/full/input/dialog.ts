/**
 * Dialog config description
 * @public
 */
export interface DialogConfig {
    /**
     * 样式类
     * @default thy-dialog
     */
    class: string | string[];
}

/**
 * Alib Dialog Ref
 * @public
 */
export class DialogRef<T> {
    /**
     * Component of dialog ref
     */
    component: T;
    /**
     * Close dialog
     */
    close(id?: string) {}
}
