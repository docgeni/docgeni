export interface DocItem {
    id: string;
    title: string;
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
    examples: string[];
}

export interface CategoryItem {
    id?: string;
    title: string;
    items?: Array<DocItem>;
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
    items: Array<CategoryItem | DocItem>;
}

export type NavigationItem = ChannelItem & CategoryItem & DocItem;
