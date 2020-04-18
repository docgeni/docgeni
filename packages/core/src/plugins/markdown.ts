import { Plugin } from './plugin';
import { DocgeniContext } from '../docgeni.interface';
import { Markdown } from '../markdown';
import { DocType } from '../enums';
import { toolkit } from '@docgeni/toolkit';

export class MarkdownPlugin implements Plugin {
    apply(docgeni: DocgeniContext): void {
        toolkit.print.info(`[MarkdownPlugin] load success`);
        docgeni.hooks.docCompile.tap('MarkdownPlugin', docSourceFile => {
            if (docSourceFile.docType === DocType.component) {
                const result = Markdown.parse(docSourceFile.content);
                docSourceFile.content = result.body;
                docSourceFile.result = {
                    html: Markdown.toHTML(docSourceFile.content),
                    meta: result.attributes
                };
            } else {
                docSourceFile.content = docSourceFile.content;
                docSourceFile.result = {
                    html: Markdown.toHTML(docSourceFile.content)
                };
            }
        });
    }
}

module.exports = MarkdownPlugin;
