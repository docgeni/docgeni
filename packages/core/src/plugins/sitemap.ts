import { Plugin } from './plugin';
import { DocgeniContext } from '../docgeni.interface';
import { resolve } from '../fs';
import { toolkit } from '@docgeni/toolkit';
import { NavigationItem } from '../interfaces';

const PLUGIN_NAME = 'SitemapPlugin';

export class SitemapPlugin implements Plugin {
    sortDocItems(navs: NavigationItem[]) {
        navs = navs.filter(nav => !nav.lib && !nav.isExternal).slice();
        const list: NavigationItem[] = [];
        while (navs.length) {
            const item = navs.shift();
            if (item.items) {
                navs.unshift(...item.items);
            } else if (!item.hidden) {
                list.push(item);
            }
        }
        return list;
    }

    generateUrls(docgeni: DocgeniContext, navs: Record<string, NavigationItem[]>): string[] {
        const allUrls: string[] = [];
        const host = docgeni.config.sitemap.host.endsWith('/') ? docgeni.config.sitemap.host : `${docgeni.config.sitemap.host}/`;
        docgeni.config.locales.forEach(locale => {
            const list = this.sortDocItems(navs[locale.key]);
            list.forEach(item => {
                const path = item.channelPath ? `${item.channelPath}/${item.path}` : item.path;
                if (path) {
                    if (allUrls.indexOf(`${host}${path}`) < 0) {
                        allUrls.push(`${host}${path}`);
                    }
                    allUrls.push(`${host}${locale.key}/${path}`);
                }
            });
        });

        return allUrls;
    }

    apply(docgeni: DocgeniContext): void {
        if (docgeni.config.sitemap?.host) {
            docgeni.hooks.navsEmitSucceed.tap(PLUGIN_NAME, async (navsBuild, config) => {
                const outputConfigPath = resolve(docgeni.paths.absSitePath, 'src/sitemap.xml');
                const content = toolkit.template.compile('sitemap-xml.hbs', {
                    urls: this.generateUrls(docgeni, config)
                });

                await docgeni.host.writeFile(outputConfigPath, content);
            });
        }
    }
}

module.exports = SitemapPlugin;
