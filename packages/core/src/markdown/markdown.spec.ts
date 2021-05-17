import { Markdown } from './markdown';
describe('markdown', () => {
    const data = ['```bash', 'ng add alib', '```'].join('\n');
    it('run', () => {
        const result = Markdown.toHTML(data);
        expect(result).not.toContain('%20');
    });
});
