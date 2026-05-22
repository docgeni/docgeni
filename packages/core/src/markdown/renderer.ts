import { Renderer, Tokens, MarkedOptions } from 'marked';
import { HeadingLink } from '../interfaces';
import { highlight as defaultHighlight } from '../utils';

/** Regular expression that matches whitespace. */
const whitespaceRegex = /( |\.|\?)/g;

const exampleRegex = /<example\W*name=['"]([^"']+)\W*(inline)?\W*\/>/g;

export type MarkdownRendererOptions = MarkedOptions & {
    absFilePath?: string;
};

export interface DocsMarkdownRendererOptions extends MarkedOptions {
    highlight?: (code: string, lang: string) => string | null | undefined;
}

function escapeHtml(code: string): string {
    return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Custom renderer for marked that will be used to transform markdown files to HTML.
 */
export class DocsMarkdownRenderer extends Renderer {
    headingLinks: HeadingLink[] = [];
    private readonly highlightFn: (code: string, lang: string) => string | null | undefined;

    constructor(options?: DocsMarkdownRendererOptions) {
        super(options);
        this.highlightFn = options?.highlight ?? defaultHighlight;
    }

    heading({ tokens, depth }: Tokens.Heading) {
        const label = this.parser.parseInline(tokens);
        if (depth === 1 || depth === 2 || depth === 3 || depth === 4) {
            const headingId = label.toLowerCase().replace(whitespaceRegex, '-');
            const encodedHeadingId = encodeURI(headingId);
            this.headingLinks.push({
                id: encodedHeadingId,
                name: label,
                level: depth,
                type: `h${depth}`,
            });
            return `
        <h${depth} id="${encodedHeadingId}" class="docs-header-link">
          <span header-link="${encodedHeadingId}"></span>
          ${label}
        </h${depth}>
      `;
        }
        return `<h${depth}>${label}</h${depth}>`;
    }

    link(token: Tokens.Link) {
        let output = super.link(token);
        if (token.href.startsWith('http')) {
            output = output.replace('<a ', `<a target="_blank" `);
        }
        return output;
    }

    paragraph({ tokens }: Tokens.Paragraph) {
        const text = this.parser.parseInline(tokens);
        if (text.startsWith('<')) {
            return '<div class="dg-paragraph">' + text + '</div>\n';
        }
        return '<p>' + text + '</p>\n';
    }

    html(token: Tokens.HTML | Tokens.Tag) {
        const text = token.text.replace(exampleRegex, (_match: string, name: string, inline: string) => {
            return `<example name="${name}" ${inline || ''}></example>`;
        });
        return super.html({ ...token, text });
    }

    /**
     * Prism highlight requires lang class on both pre and code: language-js
     */
    code({ text, lang, escaped }: Tokens.Code) {
        const language = (lang || '').match(/\S*/)?.[0] ?? '';
        let code = text.replace(/\n$/, '');
        let isEscaped = escaped ?? false;

        if (this.highlightFn && language) {
            const out = this.highlightFn(code, language);
            if (out != null && out !== code) {
                isEscaped = true;
                code = out;
            }
        }

        const content = isEscaped ? code : escapeHtml(code);

        if (!language) {
            return `<pre><code>${content}</code></pre>\n`;
        }

        const langClass = `language-${language}`;
        return `<pre class="${langClass}"><code class="${langClass}">${content}</code></pre>\n`;
    }
}
