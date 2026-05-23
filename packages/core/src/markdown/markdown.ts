import { marked } from 'marked';
import { DocsMarkdownRenderer, MarkdownRendererOptions } from './renderer';
import fm from 'front-matter';
import { highlight } from '../utils';
import { embed } from './embed';
import { codeGroup } from './code-group';
import { tabs } from './tabs';
import { HeadingLink } from '../interfaces';

marked.use({
    gfm: true,
    breaks: false,
    pedantic: false,
    extensions: [embed, codeGroup, tabs],
});

function parseMarkdown(src: string, options?: MarkdownRendererOptions): { html: string; renderer: DocsMarkdownRenderer } {
    const renderer = new DocsMarkdownRenderer({ highlight });
    const { absFilePath, ...markedOptions } = options ?? {};

    const html = marked.parse(src, {
        gfm: true,
        breaks: false,
        pedantic: false,
        async: false,
        renderer,
        ...markedOptions,
        ...(absFilePath ? { absFilePath } : {}),
    } as MarkdownRendererOptions & { async: false }) as string;

    return { html, renderer };
}

export interface MarkdownParseResult<TAttributes = unknown> {
    attributes: TAttributes;
    body: string;
    bodyBegin: number;
    frontmatter: string;
}

export class Markdown {
    static toHTML(src: string, options?: MarkdownRendererOptions) {
        return parseMarkdown(src, options).html;
    }

    static compile<TMate>(
        src: string,
        options?: MarkdownRendererOptions,
    ): {
        html: string;
        headings?: HeadingLink[];
        meta: TMate;
    } {
        const result = this.frontMatter(src);
        const { html, renderer } = parseMarkdown(result.body, options);
        return {
            html: html,
            meta: result.attributes as TMate,
            headings: renderer.headingLinks,
        };
    }

    private static frontMatter<TAttributes>(content: string): MarkdownParseResult<TAttributes> {
        const result = fm(content);
        return result as MarkdownParseResult<TAttributes>;
    }
}
