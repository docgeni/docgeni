import { Plugin } from './plugin';
import { DocgeniContext } from '../docgeni.interface';
import { toolkit } from '@docgeni/toolkit';
import { CategoryItem } from '../interfaces';

export class AngularLibPlugin implements Plugin {
    apply(context: DocgeniContext): void {
        context.logger.info(`[AngularLibPlugin] load success`);
        // let categories: CategoryItem[];
        // let categoriesNameMap: { [key: string]: CategoryItem };
        // context.hooks.libCompile.tap('AngularLibPlugin', libContext => {
        //     categories = libContext.lib.categories;
        //     categoriesNameMap = toolkit.utils.keyBy(categories, 'id');
        //     context.hooks.libComponentCompile.tap('AngularLibPlugin', (_libContext, libComponentContext) => {
        //         context.logger.info('libComponentContext', libComponentContext);
        //     });
        // });
    }
}

module.exports = AngularLibPlugin;
