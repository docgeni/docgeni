import { CategoryItem } from './navigation-item';

export interface Library {
    name: string;
    abbrName?: string;
    rootDir: string;
    categories?: CategoryItem[];
    include?: string | string[];
    exclude?: string | string[];
    docDir?: string;
    apiDir?: string;
    examplesDir?: string;
    // 绝对路径
    absRootPath?: string;
}
