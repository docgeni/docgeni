import { loadFixture, FixtureResult } from '../testing/fixture-loader';
import { strings } from '@docgeni/toolkit';
import { Markdown } from './markdown';

describe('tabs markdown extension', () => {
    let fixture: FixtureResult;

    beforeAll(async () => {
        Markdown.initializeConfig();
        fixture = await loadFixture('markdown-tabs');
    });

    it('should transform tabs markdown success', async () => {
        const output = await Markdown.toHTML(fixture.src['get.md']);
        expect(strings.compatibleNormalize(output).trim()).toEqual(fixture.getOutputContent('get.html', true));
    });

    it('should parse markdown inside tab content', async () => {
        const src = ['<tabs>', '  <tab label="代码">', '\n```typescript\n', 'const value = 1;', '\n```\n', '  </tab>', '</tabs>'].join('');

        const html = await Markdown.toHTML(src);
        expect(html).toContain('<tabs>');
        expect(html).toContain('<tab label="代码">');
        expect(html).toContain('<pre class="language-typescript">');
        expect(html).toContain('<span class="code-block-actions">');
        expect(html).toContain('<code-copy></code-copy>');
        expect(html).toContain('<span class="token keyword">const</span>');
    });

    it('should parse paragraph markdown inside tab content', async () => {
        const src = '<tabs><tab label="说明">这是一段 **加粗** 文本</tab></tabs>';
        const html = await Markdown.toHTML(src);
        expect(html).toContain('<p>这是一段 <strong>加粗</strong> 文本</p>');
    });
});
