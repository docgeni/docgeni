import { Marked } from 'marked';
import { DocsMarkdownRenderer, MarkdownRendererOptions } from './renderer';
import fm from 'front-matter';
import { highlight } from '../utils';
import { embed } from './embed';
import { codeGroup } from './code-group';
import { tabs } from './tabs';
import { DocgeniMarkdownOptions, HeadingLink } from '../interfaces';

export interface MarkdownParseResult<TAttributes = unknown> {
    attributes: TAttributes;
    body: string;
    bodyBegin: number;
    frontmatter: string;
}

export class Markdown {
    private static marked: Marked;

    static initializeConfig(options?: DocgeniMarkdownOptions) {
        const marked = new Marked({ async: true });
        marked.use({
            gfm: true,
            breaks: false,
            pedantic: false,
            extensions: [embed, codeGroup, tabs],
        });

        options?.config?.(marked);
        this.marked = marked;
    }

    private static ensureMarked() {
        if (!this.marked) {
            this.initializeConfig();
        }
    }

    static async toHTML(src: string, options?: MarkdownRendererOptions) {
        const { html } = await this.parseMarkdown(src, options);
        return html;
    }

    static async compile<TMate>(
        src: string,
        options?: MarkdownRendererOptions,
    ): Promise<{
        html: string;
        headings?: HeadingLink[];
        meta: TMate;
    }> {
        const result = this.frontMatter(src);
        const { html, renderer } = await this.parseMarkdown(result.body, options);
        return {
            html: html,
            meta: result.attributes as TMate,
            headings: renderer.headingLinks,
        };
    }

    private static async parseMarkdown(
        src: string,
        options?: MarkdownRendererOptions,
    ): Promise<{ html: string; renderer: DocsMarkdownRenderer }> {
        this.ensureMarked();
        const renderer = new DocsMarkdownRenderer({ highlight });
        const { absFilePath, ...markedOptions } = options ?? {};

        const html = (await this.marked.parse(src, {
            gfm: true,
            breaks: false,
            pedantic: false,
            async: true,
            renderer,
            ...markedOptions,
            ...(absFilePath ? { absFilePath } : {}),
        } as MarkdownRendererOptions & { async: true })) as string;

        return { html, renderer };
    }

    private static frontMatter<TAttributes>(content: string): MarkdownParseResult<TAttributes> {
        const result = fm(content);
        return result as MarkdownParseResult<TAttributes>;
    }
}
