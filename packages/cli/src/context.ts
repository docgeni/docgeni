import { DocgConfig } from './interfaces';

export interface Output {
    filename: string;
    content: string;
}

export interface DocgContext {
    config: DocgConfig;
    cwd: string;
    docs: {};
    sources: string[];
    outputs: Output[];
}
