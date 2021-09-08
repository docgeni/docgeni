import { EOL } from 'os';
import { loadFixture, FixtureResult } from '../testing/fixture-loader';
import { transformEmbed } from './embed';
import { Markdown } from './markdown';

fdescribe('markdown', () => {
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

        // it('should transform embed success', () => {
        //     const output = Markdown.toHTML(fixture.src['hello.md'], {
        //         absFilePath: fixture.srcPath
        //     });
        //     // expect(output).toEqual(fixture.output['hello.md']);
        // });

        it('should transform embed success', () => {
            const output = Markdown.toHTML('<label>xxx</label>', {
                absFilePath: fixture.srcPath
            });
            expect(output).toContain(`<p><label>xxx</label></p>`);
        });
    });

    describe('embed', () => {
        let fixture: FixtureResult;

        beforeAll(async () => {
            fixture = await loadFixture('markdown-embed');
        });

        it('should transform embed success', () => {
            const output = transformEmbed(fixture.src['hello.md'], fixture.srcPath);
            expect(output).toEqual(fixture.output['hello.md']);
        });

        it('should throw error when embed ref self', () => {
            const output = transformEmbed(fixture.src['embed-self.md'], fixture.srcPath);
            expect(output).toContain(`can't resolve path ./embed-self.md`);
        });

        it('should throw error when embed not-found.md', () => {
            const output = transformEmbed(fixture.src['not-found.md'], fixture.srcPath);
            expect(output).toContain(`can't resolve path ./ref-not-found.md`);
        });
    });
});
