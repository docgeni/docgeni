import { Plugin } from './plugin';
import { BuilderFacade } from '../builder.facade';

export class AngularLibPlugin implements Plugin {
    apply(builder: BuilderFacade): void {
        console.log(`AngularLibPlugin Load Success`);
        // builder.hooks.docCompile.tap('MarkdownPlugin', docSourceFile => {
        //     docSourceFile.content = docSourceFile.content + 'end';
        // });
    }
}

module.exports = AngularLibPlugin;
