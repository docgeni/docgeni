import { toolkit } from '@docgeni/toolkit';
import { normalize, virtualFs } from '@angular-devkit/core';
import { Observable } from 'rxjs';

export interface DocgeniHost {
    readFile(path: string): Promise<string>;
    writeFile(path: string, data: string): Promise<void>;
    pathExists(path: string): Promise<boolean>;
    isDirectory(path: string): Promise<boolean>;
    isFile(path: string): Promise<boolean>;
    watch(path: string, options?: virtualFs.HostWatchOptions): Observable<virtualFs.HostWatchEvent>;
    copy(src: string, dest: string): Promise<void>;
    delete(path: string): Promise<void>;
}

export class DocgeniHostImpl implements DocgeniHost {
    constructor(public readonly host: virtualFs.Host) {}

    async readFile(path: string): Promise<string> {
        const data = await this.host.read(normalize(path)).toPromise();
        return virtualFs.fileBufferToString(data);
    }

    async writeFile(path: string, data: string): Promise<void> {
        return this.host.write(normalize(path), virtualFs.stringToFileBuffer(data)).toPromise();
    }

    async pathExists(path: string): Promise<boolean> {
        return this.host.exists(normalize(path)).toPromise();
    }

    async isDirectory(path: string): Promise<boolean> {
        return this.host.isDirectory(normalize(path)).toPromise();
    }

    async isFile(path: string): Promise<boolean> {
        return this.host.isFile(normalize(path)).toPromise();
    }

    watch(path: string, options?: virtualFs.HostWatchOptions): Observable<virtualFs.HostWatchEvent> {
        return this.host.watch(normalize(path), options);
    }

    async stat(path: string) {
        return this.host.stat(normalize(path)).toPromise();
    }

    async copy(src: string, dest: string): Promise<void> {
        return toolkit.fs.copy(src, dest);
    }

    delete(path: string): Promise<void> {
        return this.host.delete(normalize(path)).toPromise();
    }
}

export function createDocgeniHost(host: virtualFs.Host): DocgeniHost {
    return new DocgeniHostImpl(host);
}
