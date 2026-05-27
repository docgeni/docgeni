import { toolkit } from '@docgeni/toolkit';
import { NavigationItem } from '../../interfaces';

function normalizeNavPath(path?: string): string {
    return (path || '').toLowerCase();
}

function isMergeableConfigNav(nav: NavigationItem): boolean {
    return !nav.isExternal && !nav.lib;
}

function buildMergeTargetMap(configNavs: NavigationItem[]): Map<string, NavigationItem> {
    const mergeTargetMap = new Map<string, NavigationItem>();

    for (const configNav of configNavs) {
        if (!isMergeableConfigNav(configNav)) {
            continue;
        }

        const path = normalizeNavPath(configNav.path);
        if (path) {
            mergeTargetMap.set(path, configNav);
            continue;
        }

        (configNav.items || []).forEach((child) => {
            const childNav = child as NavigationItem;
            const childPath = normalizeNavPath(childNav.path);
            if (childPath) {
                mergeTargetMap.set(childPath, childNav);
            }
        });
    }

    return mergeTargetMap;
}

function mergeDocsNavIntoConfigTarget(configNav: NavigationItem, docsNav: NavigationItem): void {
    (Object.keys(docsNav) as Array<keyof NavigationItem>).forEach((key) => {
        if (key === 'items') {
            return;
        }
        if (toolkit.utils.isUndefinedOrNull(configNav[key])) {
            (configNav as NavigationItem)[key] = docsNav[key] as never;
        }
    });

    if (!configNav.items?.length && docsNav.items?.length) {
        configNav.items = [...docsNav.items];
    }
}

/**
 * Merge docs root navs into matching config navs, then insert unmatched docs navs at insertIndex.
 */
export function mergeDocsNavs(configNavs: NavigationItem[], docsNavs: NavigationItem[], insertIndex: number): NavigationItem[] {
    const navs = configNavs.slice();
    const mergeTargetMap = buildMergeTargetMap(navs);
    const unmatchedDocsNavs: NavigationItem[] = [];

    docsNavs.forEach((docsNav) => {
        const mergeTarget = mergeTargetMap.get(normalizeNavPath(docsNav.path));
        if (mergeTarget) {
            mergeDocsNavIntoConfigTarget(mergeTarget, docsNav);
        } else {
            unmatchedDocsNavs.push(docsNav);
        }
    });

    navs.splice(insertIndex, 0, ...unmatchedDocsNavs);
    return navs;
}
