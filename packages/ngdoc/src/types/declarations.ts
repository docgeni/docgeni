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
    tags?: Record<string, { name: string; text?: { text: string; kind: string }[] }>;
    locales?: Record<string, NgPropertyDoc>;
}

export interface NgMethodDoc {
    name?: string;
    // params?: Record<string, { type: string; description: string }>;
    parameters?: { type: string; description: string }[];
    returnValue?: { type: string; description: string };
    description?: string | null;
}
