import { Renderer } from 'marked';
import { basename, extname } from 'path';
import * as Prism from 'prismjs';
/** Regular expression that matches whitespace. */
const whitespaceRegex = /\W+/g;

/** Regular expression that matches example comments. */
const exampleCommentRegex = /<!--\W*example\(([^)]+)\)\W*-->/g;

/**
 * Custom renderer for marked that will be used to transform markdown files to HTML
 * files that can be used in the Angular Material docs.
 */
export class DocsMarkdownRenderer extends Renderer {
    /**
     * Transforms a markdown heading into the corresponding HTML output. In our case, we
     * want to create a header-link for each H3 and H4 heading. This allows users to jump to
     * specific parts of the docs.
     */
    heading(label: string, level: number, raw: string) {
        if (level === 3 || level === 4) {
            const headingId = label.toLowerCase().replace(whitespaceRegex, '-');

            return `
        <h${level} id="${headingId}" class="docs-header-link">
          <span header-link="${headingId}"></span>
          ${label}
        </h${level}>
      `;
        }

        return `<h${level}>${label}</h${level}>`;
    }

    /** Transforms markdown links into the corresponding HTML output. */
    link(href: string, title: string, text: string) {
        // We only want to fix up markdown links that are relative and do not refer to guides already.
        // Otherwise we always map the link to the "guide/" path.
        // TODO(devversion): remove this logic and just disallow relative paths.
        if (!href.startsWith('http') && !href.startsWith('#') && !href.includes('guide/')) {
            return super.link(`guide/${basename(href, extname(href))}`, title, text);
        }

        return super.link(href, title, text);
    }

    /**
     * Method that will be called whenever inline HTML is processed by marked. In that case,
     * we can easily transform the example comments into real HTML elements. For example:
     *
     *  `<!-- example(name) -->` turns into `<div material-docs-example="name"></div>`
     */
    html(html: string) {
        html = html.replace(exampleCommentRegex, (_match: string, name: string) => `<div docgeni-docs-example="${name}"></div>`);

        return super.html(html);
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
            if (out != null && out !== code) {
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
