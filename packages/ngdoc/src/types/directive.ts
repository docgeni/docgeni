import { NgPropertyDoc } from './declarations';
import { NgDocItemType } from './enums';

export interface NgDirectiveMetadata {
    selector?: string;
    styleUrls?: string[];
    styles?: string[];
    templateUrl?: string;
    template?: string;
    exportAs?: string;
}

export interface NgDirectiveDoc extends NgDirectiveMetadata {
    type: NgDocItemType;
    name?: string;
    description?: string;
    properties?: NgPropertyDoc[];
}

export interface NgComponentMetadata extends NgDirectiveMetadata {
    name: string;
}
