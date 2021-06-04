import { getSystemPath, Path } from '@angular-devkit/core';
import { NodeJsAsyncHost } from '@angular-devkit/core/node';
import { constants, PathLike, promises as fsPromises } from 'fs';
import { Observable, from } from 'rxjs';

async function exists(path: PathLike): Promise<boolean> {
    try {
        await fsPromises.access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export class DocgeniNodeJsAsyncHost extends NodeJsAsyncHost {
    exists(path: Path): Observable<boolean> {
        return from(exists(getSystemPath(path)));
    }
}
