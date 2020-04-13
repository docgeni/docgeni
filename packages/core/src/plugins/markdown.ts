import { Plugin } from './plugin';
import { IDocgeni } from '../docgeni.interface';

export class MarkdownPlugin implements Plugin {
    apply(docgeni: IDocgeni): void {
        console.log(`MarkdownPlugin Load Success`);
        docgeni.hooks.docCompile.tap('MarkdownPlugin', docSourceFile => {
            docSourceFile.content = docSourceFile.content + 'end';
        });
    }
}

module.exports = MarkdownPlugin;
