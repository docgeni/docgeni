import { NgMethodDoc, NgPropertyDoc } from './declarations';
import { NgDocItemType } from './enums';

export interface NgServiceDoc {
    name?: string;
    description?: string;
    properties?: NgPropertyDoc[];
    methods?: NgMethodDoc[];
    type: NgDocItemType;
    order?: number;
}
