import { colorMetadata } from './color-metadata';

describe('color-metadata', () => {
    it('hex format color', () => {
        expect(colorMetadata('#000')).toEqual({ r: 0, g: 0, b: 0 });
        expect(colorMetadata('#fff')).toEqual({ r: 255, g: 255, b: 255 });
        expect(colorMetadata('#abc')).toEqual({ r: 0xaa, g: 0xbb, b: 0xcc });
        expect(colorMetadata('#F0A')).toEqual({ r: 0xff, g: 0x00, b: 0xaa });
        expect(colorMetadata('#000000')).toEqual({ r: 0, g: 0, b: 0 });
        expect(colorMetadata('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
        expect(colorMetadata('#0a1b2c')).toEqual({ r: 0x0a, g: 0x1b, b: 0x2c });
        expect(colorMetadata('#ABCDEF')).toEqual({ r: 0xab, g: 0xcd, b: 0xef });
    });

    it('rgb format color', () => {
        expect(colorMetadata('rgb(0,0,0)')).toEqual({ r: 0, g: 0, b: 0 });
        expect(colorMetadata('rgb(255,128,64)')).toEqual({ r: 255, g: 128, b: 64 });
        expect(colorMetadata('rgb(1, 2, 3)')).toEqual({ r: 1, g: 2, b: 3 });
        expect(colorMetadata('rgb(10 20 30)')).toEqual({ r: 10, g: 20, b: 30 });
    });
});
