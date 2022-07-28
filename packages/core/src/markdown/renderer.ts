import { Renderer, marked } from 'marked';
import { HeadingLink } from '../interfaces';
/** Regular expression that matches whitespace. */
// const whitespaceRegex = /\W+/g;
const whitespaceRegex = /( |\.|\?)/g;

/** Regular expression that matches example comments. */
const exampleCommentRegex = /<!--\W*example\(([^)]+)\)\W*-->/g;
const exampleRegex = /<example\W*name=['"]([^"']+)\W*(inline)?\W*\/>/g;

export type MarkdownRendererOptions = marked.MarkedOptions & {
    absFilePath?: string;
};

/**
 * Custom renderer for marked that will be used to transform markdown files to HTML
 * files that can be used in the Angular Material docs.
 */
export class DocsMarkdownRenderer extends Renderer<any> {
    headingLinks: HeadingLink[] = [];

    constructor(options?: MarkdownRendererOptions) {
        super(options);
    }

    /**
     * Transforms a markdown heading into the corresponding HTML output. In our case, we
     * want to create a header-link for each H3 and H4 heading. This allows users to jump to
     * specific parts of the docs.
     */
    heading(label: string, level: number, raw: string) {
        if (level === 1 || level === 2 || level === 3 || level === 4) {
            const headingId = label.toLowerCase().replace(whitespaceRegex, '-');
            const encodedHeadingId = encodeURI(headingId);
            this.headingLinks.push({
                id: encodedHeadingId,
                name: label,
                level: level,
                type: `h${level}`
            });
            return `
        <h${level} id="${encodedHeadingId}" class="docs-header-link">
          <span header-link="${encodedHeadingId}"></span>
          ${label}
        </h${level}>
      `;
        }
        return `<h${level}>${label}</h${level}>`;
    }

    /** Transforms markdown links into the corresponding HTML output. */
    link(href: string, title: string, text: string) {
        let output = super.link.call(this, href, title, text);
        if (href.startsWith('http')) {
            output = output.replace('<a ', `<a target="_blank" `);
        }
        return output;
    }

    paragraph(text: string) {
        // for custom tag e.g. <label></label> to contains <div>
        if (text.startsWith('<')) {
            return '<div class="dg-paragraph">' + text + '</div>\n';
        } else {
            return '<p>' + text + '</p>\n';
        }
    }

    /**
     * Method that will be called whenever inline HTML is processed by marked. In that case,
     * we can easily transform the example comments into real HTML elements. For example:
     *
     *  `<example name="name" />` turns into `<example name="name"></example>`
     *  `<example name="name" inline />` turns into `<example name="name" inline></example>`
     */
    html(html: string) {
        html = html.replace(exampleRegex, (_match: string, name: string, inline: string) => {
            return `<example name="${name}" ${inline || ''}></example>`;
        });

        return super.html.call(this, html);
    }

    /**
     * Method that will be called after a markdown file has been transformed to HTML. This method
     * can be used to finalize the content (e.g. by adding an additional wrapper HTML element)
     */
    finalizeOutput(output: string): string {
        return `<div class="docs-markdown">${output}</div>`;
    }

    /**
     * add langClass to tag pre, marked.js default logic set langClass to code
     * The prism.js highlight must set langClass (such as language-js) to pre tag <pre class="language-js"></pre>
     */
    code(code: string, infostring: string | undefined, escaped: boolean): string {
        const lang = (infostring || '').match(/\S*/)[0];
        if (this.options.highlight) {
            const out = this.options.highlight(code, lang) as string;
            if (out !== null && out !== code) {
                escaped = true;
                code = out;
            }
        }

        if (!lang) {
            return '<pre><code>' + (escaped ? code : escape(code)) + '</code></pre>';
        }

        const langClass = this.options.langPrefix + escape(lang);
        return `<pre class="${langClass}"><code class="${langClass}">${escaped ? code : escape(code)}</code></pre>\n`;
    }
}
