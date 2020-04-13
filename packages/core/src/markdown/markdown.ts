import * as marked from 'marked';
import { DocsMarkdownRenderer } from './renderer';

const renderer = new DocsMarkdownRenderer();

export class Markdown {
    static toHTML(src: string) {
        return marked(src, {
            renderer
        });
    }
}
