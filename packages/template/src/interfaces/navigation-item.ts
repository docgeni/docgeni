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
    toc?: 'menu' | 'content' | 'hidden' | false;
    /** 文档路径 */
    docItemPath?: DocItem[];
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
    toc?: 'menu' | 'content' | 'hidden' | false;
    /** 文档路径 */
    docItemPath?: DocItem[];
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
