import { Library } from './library';
import { NavigationItem } from './navigation-item';
import { Locale } from './locale';

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
    navs?: NavigationItem[];
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
    navs?: NavigationItem[];
    /** Locales */
    locales: Locale[];
}
