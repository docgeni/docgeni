import { isAbsolute, join, normalize, NormalizedRoot, Path, virtualFs } from '@angular-devkit/core';

export class DocgeniScopedHost<T extends object> extends virtualFs.ResolverHost<T> {
    constructor(delegate: virtualFs.Host<T>, protected root: string) {
        super(delegate);
    }

    protected _resolve(path: Path): Path {
        if (isAbsolute(path)) {
            return path;
        } else {
            return join(normalize(this.root), path) as Path;
        }
    }
}
