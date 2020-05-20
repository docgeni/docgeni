import * as marked from 'marked';
import { DocsMarkdownRenderer } from './renderer';
import * as fm from 'front-matter';
const renderer = new DocsMarkdownRenderer();

export interface MarkdownParseResult<TAttributes = unknown> {
    attributes: TAttributes;
    body: string;
    bodyBegin: number;
    frontmatter: string;
}

export class Markdown {
    static toHTML(src: string) {
        return marked(src, {
            renderer
        });
    }

    static parse<TAttributes>(content: string): MarkdownParseResult<TAttributes> {
        const result = fm(content);
        return result as MarkdownParseResult<TAttributes>;
    }
}
