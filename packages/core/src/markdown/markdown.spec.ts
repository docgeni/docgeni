import { toolkit } from '@docgeni/toolkit';
import { EOL } from 'os';
import { loadFixture, FixtureResult } from '../testing/fixture-loader';
import { Markdown } from './markdown';
import path from 'path';

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
                absFilePath: fixture.getSrcPath('hello.md')
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

    fdescribe('embed', () => {
        let fixture: FixtureResult;

        beforeAll(async () => {
            fixture = await loadFixture('markdown-embed');
        });

        it('should transform embed success', () => {
            const output = Markdown.toHTML(fixture.src['hello.md'], { absFilePath: fixture.getSrcPath('hello.md') });
            const regex = /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/;
            console.log('====head1====');
            console.log('## head1'.match(regex));
            console.log('====head2====');
            console.log(
                `## head2

            This is *bar*`.match(regex)
            );
            console.log('====bar====');
            console.log(
                Markdown.toHTML(`## Bar

            This is *bar*
            `)
            );
            console.log('====bar====');
            // expect(output.trim()).toEqual(fixture.output['hello.html'].trim());
        });

        xit('should throw error when embed ref self', () => {
            const output = Markdown.toHTML(fixture.src['embed-self.md'], { absFilePath: fixture.getSrcPath('embed-self.md') });
            expect(output).toContain(`<div embed src="./embed-self.md">can't resolve path ./embed-self.md</div>`);
        });

        xit('should throw error when embed ref-not-found.md', () => {
            const output = Markdown.toHTML(fixture.src['not-found.md'], { absFilePath: fixture.getSrcPath('not-found.md') });
            expect(output).toContain(`<div embed src="./ref-not-found.md">can't resolve path ./ref-not-found.md</div>`);
        });
    });
});
