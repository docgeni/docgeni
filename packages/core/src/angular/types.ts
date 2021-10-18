export interface AngularCommandOptions {
    port?: string | number;
    prod?: boolean;
    deployUrl?: string;
}

export interface SiteProject {
    name: string;
    root: string;
    sourceRoot?: string;
    custom?: boolean;
}
