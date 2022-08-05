import { IsNgContentChildKindPipe } from './ng-kind.pipe';

describe('ng-kind', () => {
    it('should get true by ContentChild', () => {
        const result = new IsNgContentChildKindPipe().transform('ContentChild');
        expect(result).toBe(true);
    });

    it('should get true by ContentChildren', () => {
        const result = new IsNgContentChildKindPipe().transform('ContentChildren');
        expect(result).toBe(true);
    });

    it('should get false by ContentChildren1', () => {
        const result = new IsNgContentChildKindPipe().transform('ContentChildren1');
        expect(result).toBe(false);
    });
});
