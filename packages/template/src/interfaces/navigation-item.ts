export interface DocItem {
    id: string;
    title: string;
    subtitle?: string;
    summary?: string;
    path: string;
    channelPath?: string;
    contentPath?: string;
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
    contributionInfo?: { lastUpdateTime: number; contributors: string[] };
}

export interface ComponentDocItem extends DocItem {
    examples?: string[];
    importSpecifier?: string;
    overview?: boolean;
    api?: boolean;
    category?: string;
    contributionMap?: Partial<Record<'api' | 'overview' | 'examples', { lastUpdateTime: number; contributors: string[] }>>;
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
