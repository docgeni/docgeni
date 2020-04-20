export interface DocItem {
    title: string;
    path: string;
    content?: string;
}

export interface NavigationItem {
    title: string;
    path: string;
    // 外部链接
    isExternal?: boolean;
    children?: Array<NavigationItem | DocItem>;
    lib?: string;
}

export type ChannelItem = NavigationItem;
