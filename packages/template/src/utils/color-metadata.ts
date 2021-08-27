export function colorMetadata(color: string) {
    let obj: { r: number; g: number; b: number };
    if (color.startsWith('#')) {
        obj = HexColorMetadata(color);
    } else if (color.startsWith('rgb')) {
        obj = RgbColorMetadata(color);
    } else {
        throw new Error('unsupported color format ' + color);
    }
    return obj;
}

function HexColorMetadata(color: string) {
    const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const hex = color.replace(rgx, (m: any, r: any, g: any, b: any) => r + r + g + g + b + b);
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return { r: parseInt(rgb[1], 16), g: parseInt(rgb[2], 16), b: parseInt(rgb[3], 16) };
}

function RgbColorMetadata(color: string) {
    const result = /rgb\(([0-9]{1,3})\s*[,\s]\s*([0-9]{1,3})\s*[,\s]\s*([0-9]{1,3})\)/i.exec(color);
    return {
        r: parseInt(result[1], 10),
        g: parseInt(result[2], 10),
        b: parseInt(result[3], 10)
    };
}
