import { CategoryItem } from './navigation-item';

export interface Library {
    name: string;
    abbrName?: string;
    rootDir: string;
    categories?: CategoryItem[];
    exclude?: string | string[];
}
