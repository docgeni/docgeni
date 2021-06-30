import { languageCompare } from './language-compare';

describe('language-compare', () => {
    it('default', () => {
        const result = languageCompare('zh-cn', 'zh-cn');
        expect(result).toBe(true);
    });
    it('capitalization', () => {
        let result = languageCompare('zh-CN', 'zh-cn');
        expect(result).toBe(true);
        result = languageCompare('zh-cn', 'zh-CN');
        expect(result).toBe(true);
    });
    it('underline', () => {
        let result = languageCompare('zh-cn', 'zh_cn');
        expect(result).toBe(true);
        result = languageCompare('zh_cn', 'zh-cn');
        expect(result).toBe(true);
    });
});
