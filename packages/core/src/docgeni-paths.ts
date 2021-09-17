import * as path from 'path';
import { resolve } from './fs';

export class DocgeniPaths {
    /* cwd absolute path, default is project root*/
    cwd: string;
    /* markdown docs absolute path, default is ${cwd}/docs */
    absDocsPath?: string;
    /* site build output path, only works for automatically creating site */
    absOutputPath?: string;
    /* site absolute path, detect root from siteProjectName in angular.json, if siteProjectName is empty, default is ${cwd}/_site*/
    absSitePath?: string;
    /* site docs content absolute path */
    absSiteContentPath?: string;
    /* site assets content absolute path */
    absSiteAssetsContentPath?: string;
    /* site assets content docs absolute path */
    absSiteAssetsContentDocsPath?: string;

    constructor(cwd: string, docsDir: string, outputDir: string) {
        this.cwd = cwd;
        this.absDocsPath = this.getAbsPath(docsDir);
        this.absOutputPath = this.getAbsPath(outputDir);
    }

    public getAbsPath(absOrRelativePath: string): string {
        return resolve(this.cwd, absOrRelativePath);
    }

    public setSitePaths(siteRootPath: string, siteSourceRootPath?: string): void {
        this.absSitePath = this.getAbsPath(siteRootPath);
        const siteSourceRoot = siteSourceRootPath ? this.getAbsPath(siteSourceRootPath) : path.resolve(this.absSitePath, 'src');
        this.absSiteContentPath = resolve(siteSourceRoot, './app/content');
        this.absSiteAssetsContentPath = resolve(siteSourceRoot, './assets/content');
        this.absSiteAssetsContentDocsPath = resolve(this.absSiteAssetsContentPath, './docs');
    }
}
