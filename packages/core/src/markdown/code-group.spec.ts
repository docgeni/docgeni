import { Markdown } from './markdown';

describe('code-group markdown extension', () => {
    beforeAll(() => {
        Markdown.initializeConfig();
    });

    const src = [
        ':::code-group',
        '',
        '```bash [npm]',
        'npm install -D @docgeni/cli',
        '```',
        '',
        '```bash [yarn]',
        'yarn add -D @docgeni/cli',
        '```',
        '',
        '```bash [pnpm]',
        'pnpm add -D @docgeni/cli',
        '```',
        '',
        ':::',
    ].join('\n');

    it('should render code-group as tabs with code-group mode', async () => {
        const html = await Markdown.toHTML(src);
        expect(html).toContain('<tabs mode="code-group">');
        expect(html).toContain('<tab label="npm">');
        expect(html).toContain('<tab label="yarn">');
        expect(html).toContain('<tab label="pnpm">');
    });

    it('should parse fenced code blocks inside code-group', async () => {
        const html = await Markdown.toHTML(src);
        expect(html).toContain('<pre class="language-bash">');
        expect(html).toContain('<span class="code-block-actions">');
        expect(html).toContain('<code-copy></code-copy>');
        expect(html).toContain('<span class="token function">npm</span>');
        expect(html).toContain('yarn add -D @docgeni/cli');
        expect(html).toContain('pnpm add -D @docgeni/cli');
    });
});
