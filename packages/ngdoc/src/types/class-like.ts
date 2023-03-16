import { NgMethodDoc, NgPropertyDoc } from './declarations';
import { NgDocItemType } from './enums';

/**
 * Interfaces and classes are "class-like", in that they can contain members, heritage, type parameters and decorators
 */
export interface ClassLikeDoc {
    name?: string;
    description?: string;
    properties?: NgPropertyDoc[];
    methods?: NgMethodDoc[];
    type: NgDocItemType;
    order?: number;
}
