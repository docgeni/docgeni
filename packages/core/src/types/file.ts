export interface EmitFile {
    name?: string;
    path: string;
    content?: string;
}

export interface EmitFiles {
    [key: string]: EmitFile | string;
}
