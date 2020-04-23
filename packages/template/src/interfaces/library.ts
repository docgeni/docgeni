import { CategoryItem } from './navigation-item';

export interface Library {
    name: string;
    rootPath: string;
    categories?: CategoryItem[];
}
