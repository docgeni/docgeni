import { NgMethodDoc, NgPropertyDoc } from './declarations';

export interface NgServiceDoc {
    name?: string;
    description?: string;
    properties?: NgPropertyDoc[];
    methods?: NgMethodDoc[];
}
