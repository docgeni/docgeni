import {
    normalize as normalize_,
    relative as relative_,
    resolve as resolve_,
    Path,
    getSystemPath as getSystemPath_
} from '@angular-devkit/core';

export function resolve(path1: string | Path, path2: string | Path): Path {
    return resolve_(normalize_(path1), normalize_(path2));
}

export function relative(from: string | Path, to: string | Path): Path {
    return relative_(normalize_(from), normalize_(to));
}

export function normalize(path: string) {
    return normalize_(path);
}

export function getSystemPath(path: string) {
    return getSystemPath_(normalize_(path));
}
