import marked from 'marked';
import { DocsMarkdownRenderer, MarkdownRendererOptions } from './renderer';
import fm from 'front-matter';
import { highlight } from '../utils';
import { embed } from './embed';
import { HeadingLink } from '../interfaces';

marked.use({
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false,
    extensions: [embed]
});

export interface MarkdownParseResult<TAttributes = unknown> {
    attributes: TAttributes;
    body: string;
    bodyBegin: number;
    frontmatter: string;
}

export class Markdown {
    static toHTML(src: string, options?: MarkdownRendererOptions) {
        const renderer = new DocsMarkdownRenderer();
        const content = marked(src, {
            renderer,
            highlight,
            gfm: true,
            ...options
        });
        return content;
    }

    static compile<TMate>(
        src: string,
        options?: MarkdownRendererOptions
    ): {
        html: string;
        headings?: HeadingLink[];
        meta: TMate;
    } {
        const result = this.parse(src);
        const renderer = new DocsMarkdownRenderer();
        const html = marked(result.body, {
            renderer,
            highlight,
            gfm: true,
            ...options
        });
        return {
            html: html,
            meta: result.attributes as TMate
        };
    }

    static parse<TAttributes>(content: string): MarkdownParseResult<TAttributes> {
        const result = fm(content);
        return result as MarkdownParseResult<TAttributes>;
    }
}
