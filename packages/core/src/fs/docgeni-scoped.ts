import { isAbsolute, join, normalize, NormalizedRoot, Path, virtualFs } from '@angular-devkit/core';
import nodePath from 'path';

export class DocgeniScopedHost<T extends object> extends virtualFs.ResolverHost<T> {
    constructor(delegate: virtualFs.Host<T>, protected root: string) {
        super(delegate);
    }

    // protected _resolve(path: Path): Path {
    //     if (nodePath.isAbsolute(path)) {
    //         return path;
    //     } else {
    //         return nodePath.join(this.root, path) as Path;
    //     }
    // }

    protected _resolve(path: Path): Path {
        if (isAbsolute(path)) {
            return path;
        } else {
            return join(normalize(this.root), path) as Path;
        }
    }
}
