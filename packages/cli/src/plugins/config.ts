import { Plugin } from './plugin';
import { BuilderFacade } from '../builder.facade';
import { DocgeniSiteConfig } from '../interfaces';

const PLUGIN_NAME = 'ConfigPlugin';
export class ConfigPlugin implements Plugin {
    apply(builder: BuilderFacade): void {
        const siteConfig: Partial<DocgeniSiteConfig> = {};
        builder.hooks.run.tap(PLUGIN_NAME, () => {
            siteConfig.title = builder.config.title;
            siteConfig.description = builder.config.description;
            siteConfig.locales = builder.config.locales;
            siteConfig.navs = builder.config.navs;
        });

        builder.hooks.docCompile.tap(PLUGIN_NAME, docSourceFile => {
            // console.log(docSourceFile);
        });
    }
}

module.exports = ConfigPlugin;
