import { CategoryItem } from './navigation-item';

/**
 * 包含内部属性的定义
 */
export interface Library extends LibraryConfig {
    categories?: CategoryItem[];
    // 绝对路径
    absRootPath?: string;
}

/**
 * 用户可以配置的 Library 属性
 */
export interface LibraryConfig {
    name: string;
    abbrName?: string;
    rootDir: string;
    categories?: {
        id?: string;
        title: string;
        locales?: {
            [key: string]: {
                title: string;
            };
        };
    }[];
    include?: string | string[];
    exclude?: string | string[];
    docDir?: string;
    apiDir?: string;
    examplesDir?: string;
}
