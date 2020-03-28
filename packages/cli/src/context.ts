import { DocgeniConfig } from './interfaces';

export interface Output {
    filename: string;
    content: string;
}

export interface DocgeniContext {
    config: DocgeniConfig;
    cwd: string;
    docs: {};
    sources: string[];
    outputs: Output[];
}
