import { DocItem, HomeDocMeta, NavigationItem } from '../../interfaces';

/** Per-locale merged navigation output (config + docs + libraries). */
export interface LocaleNavigationArtifact {
    locale: string;
    navs: NavigationItem[];
    docs: DocItem[];
    homeMeta?: HomeDocMeta;
}
