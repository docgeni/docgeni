import { PropertyNamePipe } from './property-name.pipe';

describe('property-name', () => {
    it('should get property name for Input', () => {
        const result = new PropertyNamePipe().transform({
            kind: 'Input',
            name: 'thyType',
            type: 'string',
        });
        expect(result).toEqual('thyType');
    });

    it('should get property name with alias name for Input', () => {
        const result = new PropertyNamePipe().transform({
            kind: 'Input',
            name: 'thyType',
            type: 'string',
            aliasName: 'thyTypeAlias',
        });
        expect(result).toEqual('thyTypeAlias');
    });

    it('should get property name for Output', () => {
        const result = new PropertyNamePipe().transform({
            kind: 'Output',
            name: 'thyChange',
            type: 'EventEmitter<boolean>',
        });
        expect(result).toEqual('(thyChange)');
    });

    it('should get property name with alias name for Output', () => {
        const result = new PropertyNamePipe().transform({
            kind: 'Output',
            name: 'thyChange',
            aliasName: 'thyChangeAlias',
            type: 'EventEmitter<boolean>',
        });
        expect(result).toEqual('(thyChangeAlias)');
    });

    it('should get property name for ContentChild', () => {
        const result = new PropertyNamePipe().transform({
            kind: 'ContentChild',
            name: 'header',
            type: 'TemplateRef<unknown>',
        });
        expect(result).toEqual('#header');
    });

    it('should get property name with alias name for ContentChild', () => {
        const result = new PropertyNamePipe().transform({
            kind: 'ContentChild',
            name: 'header',
            aliasName: 'headerAlias',
            type: 'TemplateRef<unknown>',
        });
        expect(result).toEqual('#headerAlias');
    });

    it('should get property name for ContentChildren', () => {
        const result = new PropertyNamePipe().transform({
            kind: 'ContentChildren',
            name: 'header',
            type: 'TemplateRef<unknown>',
        });
        expect(result).toEqual('#header');
    });

    it('should get property name with alias name for ContentChildren', () => {
        const result = new PropertyNamePipe().transform({
            kind: 'ContentChildren',
            name: 'header',
            aliasName: 'headerAlias',
            type: 'TemplateRef<unknown>',
        });
        expect(result).toEqual('#headerAlias');
    });
});
