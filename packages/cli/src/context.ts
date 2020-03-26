import { DocgenConfig } from './interfaces';

export interface Output {
    filename: string;
    content: string;
}

export interface DocgenContext {
    config: DocgenConfig;
    cwd: string;
    sources: string[];
    outputs: Output[];
}
