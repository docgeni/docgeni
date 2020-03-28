import { Plugin } from './plugin';
import { BuilderFacade } from '../builder.facade';
import { DocgeniOutputConfig } from 'src/interfaces';

const PLUGIN_NAME = 'ConfigPlugin';
export class ConfigPlugin implements Plugin {
    apply(builder: BuilderFacade): void {
        const outputConfig: Partial<DocgeniOutputConfig> = {};
        builder.hooks.run.tap(PLUGIN_NAME, () => {
            outputConfig.title = builder.config.title;
            outputConfig.description = builder.config.description;
            outputConfig.locales = builder.config.locales;
            outputConfig.navs = builder.config.navs;
        });

        builder.hooks.docCompile.tap(PLUGIN_NAME, docSourceFile => {
            // console.log(docSourceFile);
        });
    }
}

module.exports = ConfigPlugin;
