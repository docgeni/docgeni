// export interface NavItemBase<T> {
//     /* Title of Nav */
//     title: string;
//     /** 别名 */
//     alias: string;
//     /** 路径 url */
//     path: string;
//     /** 图标 */
//     icon?: string;
//     children?: T[];
// }

// export interface ComponentsNavItem extends NavItemBase<ComponentsNavItem> {
//     lib?: string;
// }

// export interface DocNavItem extends NavItemBase<DocNavItem> {
//     isExternal?: boolean;
//     content?: string;
// }

export interface NavItem {
    /* Title of Nav */
    title: string;
    /** 别名 */
    alias?: string;
    /** 路径 url */
    path?: string;
    /** 图标 */
    icon?: string;
    children?: NavItem[];
    lib?: string;
    isExternal?: boolean;
    content?: string;
}

export interface Locale {
    key: string;
    name: string;
}

export interface Library {
    name: string;
    rootPath: string;
}

export interface DocgeniConfig {
    /* Title of documentation */
    title: string;
    /* Description of documentation */
    description: string;
    /* Docs folder */
    docsPath: string;
    /* Angular docs site app path */
    sitePath: string;
    /* Components folder */
    // componentsFolder: string[];
    libs: Library[];
    /* Output folder */
    output?: string;
    /* Navigations for menu and nav */
    navs?: NavItem[];
    /** 覆盖自动生成的导航 */
    navsCover: boolean;
    /* In silent mode, log messages aren't logged in the console */
    silent: boolean;
    /** Locales */
    locales: Locale[];
}

// For Angular Template
export interface DocgeniSiteConfig {
    /* Title of documentation */
    title: string;
    /* Description of documentation */
    description: string;
    /* Navigations for menu and nav */
    navs?: NavItem[];
    /** Locales */
    locales: Locale[];
}

export const DEFAULT_CONFIG: Partial<DocgeniConfig> = {
    title: 'Docgeni',
    silent: false,
    docsPath: 'docs',
    sitePath: 'site',
    output: 'docs-built',
    locales: [
        {
            key: 'en-us',
            name: 'EN'
        },
        {
            key: 'zh-cn',
            name: '中文'
        }
    ]
};
