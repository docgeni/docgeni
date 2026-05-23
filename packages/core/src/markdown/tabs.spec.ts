import { Markdown } from './markdown';

describe('tabs markdown extension', () => {
    it('should parse markdown inside tab content', () => {
        const src = ['<tabs>', '  <tab label="代码">', '```typescript', 'const value = 1;', '```', '  </tab>', '</tabs>'].join('\n');

        const html = Markdown.toHTML(src);
        expect(html).toContain('<tabs>');
        expect(html).toContain('<tab label="代码">');
        expect(html).toContain('<pre class="language-typescript">');
        expect(html).toContain('<span class="code-block-actions">');
        expect(html).toContain('<code-copy></code-copy>');
        expect(html).toContain('<span class="token keyword">const</span>');
    });

    it('should parse paragraph markdown inside tab content', () => {
        const src = '<tabs><tab label="说明">这是一段 **加粗** 文本</tab></tabs>';
        const html = Markdown.toHTML(src);
        expect(html).toContain('<p>这是一段 <strong>加粗</strong> 文本</p>');
    });
});
