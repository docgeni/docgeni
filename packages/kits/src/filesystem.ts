import * as fsExtra from 'fs-extra';

export function throwErrorWhenNotExists(absPath: string) {
    if (!fsExtra.existsSync(absPath)) {
        throw new Error(`${absPath} has not exists`);
    }
}
export * from 'fs-extra';
