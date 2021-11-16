import { NgDocItemType, NgPropertyKind } from './enums';

export interface NgPropertyDoc {
    description?: string | null;
    name?: string;
    aliasName?: string;
    options?: (string | number)[] | null;
    kind?: NgPropertyKind;
    type?: string | null;
    /** 默认值 */
    default?: string | number | boolean | null | object;
    jsDocTags?: { name: string; text?: string }[];
}

export interface NgDirectiveMeta {
    selector?: string;
    styleUrls?: string[];
    styles?: string[];
    templateUrl?: string;
    template?: string;
    exportAs?: string;
}

export interface NgDirectiveDoc extends NgDirectiveMeta {
    type: NgDocItemType;
    name?: string;
    description?: string;
    properties?: NgPropertyDoc[];
}

export interface NgComponentInfo extends NgDirectiveMeta {
    name: string;
}
