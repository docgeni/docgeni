import { NgMethodDoc } from './declarations';
import { NgDocItemType } from './enums';

export interface NgPipeDoc extends NgPipeMetadata {
    name?: string;
    description?: string;
    type: NgDocItemType;
    order?: number;
    methods?: NgMethodDoc[];
}

export interface NgPipeMetadata {
    name?: string;
    pure?: boolean;
    standalone?: boolean;
}
