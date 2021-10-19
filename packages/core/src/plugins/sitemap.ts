import { Plugin } from './plugin';
import { DocgeniContext } from '../docgeni.interface';
import { resolve } from '../fs';
import { toolkit } from '@docgeni/toolkit';
import { DocItem, NavigationItem } from '../interfaces';

const PLUGIN_NAME = 'SitemapPlugin';

export default class SitemapPlugin implements Plugin {
    generateUrls(docgeni: DocgeniContext, docItemsMap: Record<string, NavigationItem[]>): string[] {
        const allUrls: string[] = [];
        const host = docgeni.config.sitemap.host.endsWith('/') ? docgeni.config.sitemap.host : `${docgeni.config.sitemap.host}/`;
        docgeni.config.locales.forEach(locale => {
            (docItemsMap[locale.key] || []).forEach(item => {
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
            docgeni.hooks.navsEmitSucceed.tap(PLUGIN_NAME, async (navsBuild, config: Record<string, DocItem[]>) => {
                const outputConfigPath = resolve(docgeni.paths.absSitePath, 'src/sitemap.xml');
                const content = toolkit.template.compile('sitemap-xml.hbs', {
                    urls: this.generateUrls(docgeni, config)
                });

                await docgeni.host.writeFile(outputConfigPath, content);
            });
        }
    }
}
