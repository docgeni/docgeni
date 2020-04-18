import { Plugin } from './plugin';
import { DocgeniContext } from '../docgeni.interface';
import { DocgeniSiteConfig } from 'src/interfaces';

const PLUGIN_NAME = 'ConfigPlugin';
export class ConfigPlugin implements Plugin {
    apply(docgeni: DocgeniContext): void {
        const siteConfig: Partial<DocgeniSiteConfig> = {};
        docgeni.hooks.run.tap(PLUGIN_NAME, () => {
            siteConfig.title = docgeni.config.title;
            siteConfig.description = docgeni.config.description;
            siteConfig.locales = docgeni.config.locales;
            siteConfig.navs = docgeni.config.navs;
        });

        docgeni.hooks.docCompile.tap(PLUGIN_NAME, docSourceFile => {
            // console.log(docSourceFile);
        });
    }
}

module.exports = ConfigPlugin;
