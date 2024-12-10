import { colorMetadata } from './color-metadata';

describe('color-metadata', () => {
    it('hex format color', () => {
        for (let r = 0; r < 16; r++) {
            for (let g = 0; g < 16; g++) {
                for (let b = 0; b < 16; b++) {
                    const result = colorMetadata(`#${r.toString(16)}${g.toString(16)}${b.toString(16)}`);
                    expect(result.r).toEqual(parseInt(`${r.toString(16)}${r.toString(16)}`, 16));
                    expect(result.g).toEqual(parseInt(`${g.toString(16)}${g.toString(16)}`, 16));
                    expect(result.b).toEqual(parseInt(`${b.toString(16)}${b.toString(16)}`, 16));
                }
            }
        }
        for (let r = 0; r < 255; r += 5) {
            for (let g = 0; g < 255; g += 5) {
                for (let b = 0; b < 255; b += 5) {
                    const result = colorMetadata(
                        `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
                    );
                    expect(result.r).toEqual(r);
                    expect(result.g).toEqual(g);
                    expect(result.b).toEqual(b);
                }
            }
        }
    });
    it('rgb format color', () => {
        for (let r = 0; r < 255; r += 5) {
            for (let g = 0; g < 255; g += 5) {
                for (let b = 0; b < 255; b += 5) {
                    const result = colorMetadata(`rgb(${r},${g},${b})`);
                    expect(result.r).toEqual(r);
                    expect(result.g).toEqual(g);
                    expect(result.b).toEqual(b);
                }
            }
        }
    });
});
