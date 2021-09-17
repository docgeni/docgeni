import { virtualFs } from '@angular-devkit/core';

export interface VfsHost extends virtualFs.Host {
    copy(src: string, dest: string): Promise<void>;
}
