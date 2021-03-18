import { Library } from './library';
import { NavigationItem } from './navigation-item';
import { Locale } from './locale';
export interface HomeDocMeta {
    title: string;
    hero: {
        title: string;
        description: string;
        actions: { text: string; link: string }[];
    };
    features: {
        icon: string;
        title: string;
        description: string;
    }[];
    footer: string;
}

export type DocgeniMode = 'full' | 'lite';
export interface DocgeniConfig {
    $schema?: string;
    /* Title of documentation, e.g: Docgeni */
    title: string;
    /** Heading of documentation, e.g: Doc Generator, default is same as title */
    heading?: string;
    /* Description of documentation */
    description?: string;
    /* Mode of documentation, full mode contains nav, home page, lite mode only contains menu and doc viewers */
    mode?: DocgeniMode;
    /** Theme, angular navbar style and default style */
    theme?: 'default' | 'angular';
    /* Base href of documentation, default is / */
    baseHref?: string;
    /* Heads of documentation*/
    heads?: [];
    /* Logo url*/
    logoUrl?: string;
    /* Repo url*/
    repoUrl?: string;
    /* Docs dir, default is 'docs' */
    docsDir: string;
    /** Site default dir .docgeni */
    siteDir?: string;
    /* Site output dir, default is dist/docgeni-site */
    output?: string;
    /* Angular demo site name in angular.json */
    siteProjectName?: string;
    /* Components library folder */
    libs?: Library[];
    /* Navigations for menu and nav */
    navs?: NavigationItem[];
    /** 覆盖自动生成的导航 */
    navsCover?: boolean;
    /* In silent mode, log messages aren't logged in the console */
    silent?: boolean;
    /** Locales */
    locales?: Locale[];
    /** Default locale */
    defaultLocale?: string;
}

// For Angular Template
export interface DocgeniSiteConfig {
    /* Title of documentation, e.g: Docgeni */
    title: string;
    /** Heading of documentation, e.g: Doc Generator, default is same as title */
    heading?: string;
    /* Description of documentation */
    description?: string;
    /* Mode of documentation, full mode contains nav, home page, lite mode only contains menu and doc viewers */
    mode?: 'full' | 'lite';
    /** Theme, angular navbar style and default style */
    theme?: 'default' | 'angular';
    /* Base href of documentation, default is / */
    baseHref?: string;
    /* Heads of documentation*/
    heads?: [];
    /* Logo url*/
    logoUrl?: string;
    /* Repo url*/
    repoUrl?: string;
    /** Home meta */
    homeMeta?: HomeDocMeta;
    /* Navigations for menu and nav */
    navs: NavigationItem[];
    // navs?: {
    //     [key: string]: NavigationItem[];
    // };
    /** Locales */
    locales?: Locale[];
    defaultLocale?: string;
}
