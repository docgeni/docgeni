export function compatibleNormalize(input: string) {
    return input
        .replace(/\r\n|\r/g, '\n')
        .replace(/\t/g, '    ')
        .trim();
}
