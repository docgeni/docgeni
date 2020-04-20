import { LiveExample } from './example';

export interface DocItem {
    id: string;
    title: string;
    subtitle: string;
    summary?: string;
    path: string;
    content?: string;
    // 多语言
    locals?: {
        [key: string]: {
            title: string;
            summary?: string;
            content?: string;
        };
    };
}

export interface ComponentDocItem extends DocItem {
    examples?: LiveExample[];
}

export interface CategoryItem {
    id?: string;
    title: string;
    items?: Array<DocItem | ComponentDocItem>;
}

export interface ChannelItem {
    id: string;
    title: string;
    path: string;
    isExternal?: boolean;
    lib?: string;
    locals?: {
        [key: string]: {
            title: string;
        };
    };
    items?: Array<CategoryItem | DocItem>;
}

export type NavigationItem = ChannelItem & CategoryItem & DocItem;

// export interface NavItem {
//     /* Title of Nav */
//     title: string;
//     /** 别名 */
//     subtitle?: string;
//     /** 路径 url */
//     path?: string;
//     /** 图标 */
//     icon?: string;
//     items?: NavItem[];
//     lib?: string;
//     isExternal?: boolean;
//     content?: string;
// }
