import { Plugin } from './plugin';
import { DocgeniContext } from '../docgeni.interface';
import { ComponentsBuilder } from '../builders/components-builder';

const PLUGIN_NAME = 'CustomComponentsPlugin';

export default class CustomComponentsPlugin implements Plugin {
    apply(docgeni: DocgeniContext): void {
        docgeni.hooks.compilation.tap(PLUGIN_NAME, async () => {
            const componentsBuilder = new ComponentsBuilder(docgeni);
            await componentsBuilder.build();
            await componentsBuilder.emit();
            componentsBuilder.watch();
        });
    }
}
