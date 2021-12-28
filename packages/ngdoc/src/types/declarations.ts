import { NgDocItemType, NgPropertyKind } from './enums';

export interface NgPropertyType {
    name: string;
    options?: (string | number)[] | null;
    kindName?: string;
}

export interface NgPropertyDoc {
    name?: string;
    aliasName?: string;
    description?: string | null;
    kind?: NgPropertyKind;
    type?: string | null | NgPropertyType;
    /** 默认值 */
    default?: string | number | boolean | null | object;
    tags?: Record<string, { name: string; text?: string }>;
}