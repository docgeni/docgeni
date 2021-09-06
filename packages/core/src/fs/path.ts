import { normalize as normalize_, relative as relative_, resolve as resolve_, Path } from '@angular-devkit/core';

export function resolve(path1: string | Path, path2: string | Path): Path {
    return resolve_(normalize_(path1), normalize_(path2));
}

export function relative(from: string | Path, to: string | Path): Path {
    return relative_(normalize_(from), normalize_(to));
}

export function normalize(path: string) {
    return normalize_(path);
}
