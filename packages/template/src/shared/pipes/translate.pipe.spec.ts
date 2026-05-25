import { translateByLocale } from './translate.pipe';

describe('translate OVERVIEW ans EXAMPLE', () => {
    it('should translate correct zh-cn', () => {
        expect(translateByLocale('OVERVIEW', 'zh-cn')).toEqual('概览');
        expect(translateByLocale('EXAMPLES', 'zh-cn')).toEqual('示例');
        expect(translateByLocale('EXAMPLES_NOT_FOUND', 'zh-cn')).toEqual('EXAMPLES_NOT_FOUND');
    });

    it('should translate correct for en-us', () => {
        expect(translateByLocale('OVERVIEW', 'en-us')).toEqual('Overview');
        expect(translateByLocale('EXAMPLES', 'en-us')).toEqual('Examples');
    });

    it('should translate correct for en-US', () => {
        expect(translateByLocale('OVERVIEW', 'en-US')).toEqual('Overview');
        expect(translateByLocale('EXAMPLES', 'en-US')).toEqual('Examples');
    });

    it('should translate correct result for not support lang', () => {
        expect(translateByLocale('OVERVIEW', 'not-found')).toEqual('Overview');
        expect(translateByLocale('EXAMPLES', 'not-found')).toEqual('Examples');
    });
});
