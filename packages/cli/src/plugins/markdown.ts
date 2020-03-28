import { Plugin } from './plugin';
import { BuilderFacade } from '../builder.facade';

export class MarkdownPlugin implements Plugin {
    apply(builder: BuilderFacade): void {
        console.log(`MarkdownPlugin Load Success`);
        builder.hooks.docCompile.tap('MarkdownPlugin', docSourceFile => {
            docSourceFile.content = docSourceFile.content + 'end';
        });
    }
}

module.exports = MarkdownPlugin;
