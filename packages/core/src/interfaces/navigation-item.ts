import { HeadingLink } from './toc';

export type DocItemToc = 'menu' | 'content' | 'hidden' | false;

export interface DocItem {
    id: string;
    title: string;
    subtitle?: string;
    summary?: string;
    path: string;
    channelPath?: string;
    contentPath?: string;
    originPath?: string;
    content?: string;
    order?: number;
    hidden?: boolean;
    // 多语言
    locales?: {
        [key: string]: {
            title: string;
            summary?: string;
            content?: string;
        };
    };
    toc?: DocItemToc;
    headings?: HeadingLink[];
}

export interface ComponentDocItem extends DocItem {
    examples?: string[];
    importSpecifier?: string;
    overview?: boolean;
    api?: boolean;
    category?: string;
    label?: { text: string; color: string };
}

export interface CategoryItem {
    id?: string;
    title: string;
    subtitle?: string;
    items?: Array<DocItem | ComponentDocItem>;
    locales?: {
        [key: string]: {
            title: string;
            subtitle?: string;
        };
    };
}

export interface ChannelItem {
    id: string;
    title: string;
    path: string;
    fullPath?: string;
    isExternal?: boolean;
    lib?: string;
    locales?: {
        [key: string]: {
            title: string;
        };
    };
    items?: Array<CategoryItem | DocItem>;
}

export type NavigationItem = ChannelItem & CategoryItem & DocItem & ComponentDocItem;
