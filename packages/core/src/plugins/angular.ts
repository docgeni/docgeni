import { Plugin } from './plugin';
import { DocgeniContext } from '../docgeni.interface';
import { toolkit } from '@docgeni/toolkit';

export class AngularLibPlugin implements Plugin {
    apply(docgeni: DocgeniContext): void {
        toolkit.print.info(`[AngularLibPlugin] load success`);
        // builder.hooks.docCompile.tap('MarkdownPlugin', docSourceFile => {
        //     docSourceFile.content = docSourceFile.content + 'end';
        // });
    }
}

module.exports = AngularLibPlugin;
