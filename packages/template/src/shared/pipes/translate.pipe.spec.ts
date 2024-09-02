import { GlobalContext } from './../../services/global-context';
import { TranslatePipe } from './translate.pipe';

describe('translate OVERVIEW ans EXAMPLE', () => {
    it('should translate correct zh-cn', () => {
        const translate = new TranslatePipe({ locale: 'zh-cn' } as GlobalContext);
        expect(translate.transform('OVERVIEW')).toEqual('概览');
        expect(translate.transform('EXAMPLES')).toEqual('示例');
        expect(translate.transform('EXAMPLES_NOT_FOUND')).toEqual('EXAMPLES_NOT_FOUND');
    });

    it('should translate correct for en-us', () => {
        const translate = new TranslatePipe({ locale: 'en-us' } as GlobalContext);
        expect(translate.transform('OVERVIEW')).toEqual('Overview');
        expect(translate.transform('EXAMPLES')).toEqual('Examples');
    });

    it('should translate correct for en-US', () => {
        const translate = new TranslatePipe({ locale: 'en-US' } as GlobalContext);
        expect(translate.transform('OVERVIEW')).toEqual('Overview');
        expect(translate.transform('EXAMPLES')).toEqual('Examples');
    });

    it('should translate correct result for not support lang', () => {
        const translate = new TranslatePipe({ locale: 'not-found' } as GlobalContext);
        expect(translate.transform('OVERVIEW')).toEqual('Overview');
        expect(translate.transform('EXAMPLES')).toEqual('Examples');
    });
});
