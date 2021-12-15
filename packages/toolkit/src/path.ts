export const directorySeparator = '/';
export const altDirectorySeparator = '\\';
const backslashRegExp = /\\/g;

export function normalizeSlashes(path: string): string {
    const index = path.indexOf('\\');
    if (index === -1) {
        return path;
    }
    backslashRegExp.lastIndex = index; // prime regex with known position
    return path.replace(backslashRegExp, directorySeparator);
}
