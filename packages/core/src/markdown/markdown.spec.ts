import { loadFixture, FixtureResult } from '../testing/fixture-loader';
import { Markdown } from './markdown';
import { strings } from '@docgeni/toolkit';

describe('markdown', () => {
    it('should get correct result for base and ng command', () => {
        const data = ['```bash', 'ng add alib', '```'].join('\n');
        const result = Markdown.toHTML(data);
        expect(result).not.toContain('%20');
        expect(result).toContain(`<span class="token function">ng</span>`);
    });

    describe('full', () => {
        let fixture: FixtureResult;

        beforeAll(async () => {
            fixture = await loadFixture('markdown-full');
        });

        it('should transform full marked success', () => {
            const output = Markdown.toHTML(fixture.src['hello.md'], {
                absFilePath: fixture.getSrcPath('hello.md'),
            });
            expect(output).toContain(`This is an <h1> tag`);
            expect(output).toContain(`This is an <h2> tag`);
            expect(output).toContain(`<example name="my-example" ></example>`);
        });

        it('should transform custom tag success', () => {
            const output = Markdown.toHTML('<label><div>content</div></label>', {});
            expect(output).toContain(`<div class="dg-paragraph"><label><div>content</div></label></div>`);
        });
    });

    describe('link', () => {
        it('should renderer link success', () => {
            const output = Markdown.toHTML('[book](./book)', {});
            expect(output).toContain(`<a href="./book">book</a>`);
        });

        it('should add target="_blank" for external link', () => {
            const output = Markdown.toHTML('[book](http://pingcode.com/book)', {});
            expect(output).toContain(`<a target="_blank" href="http://pingcode.com/book">book</a>`);
        });
    });

    describe('embed', () => {
        let fixture: FixtureResult;

        beforeAll(async () => {
            fixture = await loadFixture('markdown-embed');
        });

        it('should transform embed success', () => {
            const output = Markdown.toHTML(fixture.src['hello.md'], { absFilePath: fixture.getSrcPath('hello.md') });
            expect(strings.compatibleNormalize(output).trim()).toEqual(fixture.getOutputContent('hello.html', true));
        });

        it('should throw error when embed ref self', () => {
            const output = Markdown.toHTML(fixture.src['embed-self.md'], { absFilePath: fixture.getSrcPath('embed-self.md') });
            expect(output).toContain(`<div embed src="./embed-self.md">can't resolve path ./embed-self.md</div>`);
        });

        it('should throw error when embed ref-not-found.md', () => {
            const output = Markdown.toHTML(fixture.src['not-found.md'], { absFilePath: fixture.getSrcPath('not-found.md') });
            expect(output).toContain(`<div embed src="./ref-not-found.md">can't resolve path ./ref-not-found.md</div>`);
        });
    });

    describe('heading', () => {
        it('should get correct headings', () => {
            const result = Markdown.compile(`
# heading1
# heading2
`);
            expect(result.html).toContain(`<h1 id="heading1" class="docs-header-link">`);
            expect(result.html).toContain(`<h1 id="heading2" class="docs-header-link">`);
            expect(result.headings?.length).toEqual(2);
            expect(result.headings).toEqual([
                { id: 'heading1', name: 'heading1', level: 1, type: 'h1' },
                { id: 'heading2', name: 'heading2', level: 1, type: 'h1' },
            ]);
        });

        it('should get correct headings when contains link', () => {
            const result = Markdown.compile(`# heading1 <a href="https://example.com">Link</a>`);
            expect(result.html).toContain(`<h1 id="heading1-%3Ca-href=%22https://example-com%22%3Elink%3C/a%3E" class="docs-header-link">`);
            expect(result.headings?.length).toEqual(1);
            expect(result.headings).toEqual([
                {
                    id: 'heading1-%3Ca-href=%22https://example-com%22%3Elink%3C/a%3E',
                    name: 'heading1 <a href="https://example.com">Link</a>',
                    level: 1,
                    type: 'h1',
                },
            ]);
        });

        it('should get one header when content + code snippet,', () => {
            /**
             * marked v4.2.3 有一个破坏性更改，导致代码也解析成了标题
             * 参考: https://github.com/markedjs/marked/issues/2735
             */
            const result = Markdown.compile(`
## heading1
对于普通页面文档，想要自定义路由，设置标题，可以使用名为。
\`\`\`markdown
---
title: Button Base
name: basic
order: 1
---
\`\`\``);
            expect(result.headings?.length).toBe(1);
            expect(result.headings![0]).toEqual({ id: 'heading1', name: 'heading1', level: 2, type: 'h2' });
        });
    });
});
