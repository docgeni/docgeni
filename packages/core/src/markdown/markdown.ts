import * as marked from 'marked';
import { DocsMarkdownRenderer } from './renderer';
import * as fm from 'front-matter';
const renderer = new DocsMarkdownRenderer();

export interface MarkdownParseResult {
    attributes: {
        category: string;
        title: string;
        subtitle: string;
        description?: string;
    };
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

    static parse(content: string): MarkdownParseResult {
        const result = fm(content);
        return result as MarkdownParseResult;
    }
}
