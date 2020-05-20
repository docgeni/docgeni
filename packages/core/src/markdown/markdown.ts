import * as marked from 'marked';
import { DocsMarkdownRenderer } from './renderer';
import * as fm from 'front-matter';
const renderer = new DocsMarkdownRenderer();
import * as Prism from 'node-prismjs';

export interface MarkdownParseResult<TAttributes = unknown> {
    attributes: TAttributes;
    body: string;
    bodyBegin: number;
    frontmatter: string;
}

function highlight(sourceCode: string, lang: string) {
    const language = Prism.languages[lang] || Prism.languages.autoit;
    return Prism.highlight(sourceCode, language);
}

export class Markdown {
    static toHTML(src: string) {
        return marked(src, {
            renderer,
            highlight
        });
    }

    static parse<TAttributes>(content: string): MarkdownParseResult<TAttributes> {
        const result = fm(content);
        return result as MarkdownParseResult<TAttributes>;
    }
}
