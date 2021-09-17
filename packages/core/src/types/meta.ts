import { HomeDocMeta } from '../interfaces';

export interface ComponentDocMeta {
    title?: string;
    name?: string;
    category?: string;
    subtitle?: string;
    description?: string;
    order?: number;
    hidden?: boolean;
    label?: string;
    lastUpdatedTime?: number;
    contributors?: string[];
    toc?: 'menu' | 'content' | 'hidden' | false;
}

export interface CategoryDocMeta {
    title: string;
    order?: number;
    path?: string;
    hidden?: boolean;
}

export interface GeneralDocMeta {
    title: string;
    path?: string;
    order?: number;
    hidden?: boolean;
}

export type DocMeta = ComponentDocMeta & GeneralDocMeta & HomeDocMeta;
