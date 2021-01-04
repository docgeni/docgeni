import { Plugin } from './plugin';
import { DocgeniContext, DocMeta } from '../docgeni.interface';
import { Markdown } from '../markdown';
import { DocType } from '../enums';
import { toolkit } from '@docgeni/toolkit';

export class MarkdownPlugin implements Plugin {
    apply(docgeni: DocgeniContext): void {
        // toolkit.print.info(`Markdown plugin has been loaded`);
        // docgeni.hooks.docCompile.tap('MarkdownPlugin', docSourceFile => {
        //     if (docSourceFile.docType === DocType.component) {
        //         const result = Markdown.parse<DocMeta>(docSourceFile.content);
        //         docSourceFile.content = result.body;
        //         docSourceFile.result = {
        //             html: Markdown.toHTML(docSourceFile.content),
        //             meta: result.attributes
        //         };
        //     } else {
        //         const result = Markdown.parse<DocMeta>(docSourceFile.content);
        //         docSourceFile.ext = '.html';
        //         docSourceFile.content = result.body;
        //         docSourceFile.result = {
        //             html: Markdown.toHTML(docSourceFile.content),
        //             meta: result.attributes
        //         };
        //     }
        // });
    }
}

module.exports = MarkdownPlugin;
