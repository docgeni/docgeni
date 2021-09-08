import marked from 'marked';
import { DocsMarkdownRenderer, MarkdownRendererOptions } from './renderer';
import fm from 'front-matter';
import { highlight } from '../utils';
import { transformEmbed } from './embed';

export interface MarkdownParseResult<TAttributes = unknown> {
    attributes: TAttributes;
    body: string;
    bodyBegin: number;
    frontmatter: string;
}

export class Markdown {
    static toHTML(src: string, options?: MarkdownRendererOptions) {
        const renderer = new DocsMarkdownRenderer(options);
        const content = marked(transformEmbed(src, options ? options.absFilePath : null), {
            renderer,
            highlight,
            gfm: true
        });
        return content;
    }

    static parse<TAttributes>(content: string): MarkdownParseResult<TAttributes> {
        const result = fm(content);
        return result as MarkdownParseResult<TAttributes>;
    }
}
