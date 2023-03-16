import { NgMethodDoc, NgPropertyDoc } from './declarations';
import { NgDocItemType } from './enums';

export interface ClassOrInterfaceDoc {
    name?: string;
    description?: string;
    properties?: NgPropertyDoc[];
    methods?: NgMethodDoc[];
    type: NgDocItemType;
    order?: number;
}
