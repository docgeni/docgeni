import { DocgeniContext, CategoryDocMeta } from './docgeni.interface';
import * as vinyl from 'vinyl';
import * as vfs from 'vinyl-fs';
import * as through2 from 'through2';
import { toolkit } from '@docgeni/toolkit';
import { NavigationItem, ComponentDocItem } from './interfaces';
import * as path from 'path';
import { getDocRoutePath, getDocTitle, createDocSourceFile, isEntryDoc, combineRoutePath } from './utils';
import { DocType } from './enums';

export class DocsCompiler {
    private docsNavInsertIndex: number;

    private localesDocsDataMap: Record<
        string,
        {
            navs: NavigationItem[];
            homeMeta?: {};
        }
    > = {};

    private get config() {
        return this.docgeni.config;
    }

    getLocaleNavs(locale: string) {
        return (this.localesDocsDataMap[locale] && this.localesDocsDataMap[locale].navs) || [];
    }

    constructor(private docgeni: DocgeniContext) {}

    async compile() {
        this.setDocsNavInsertIndex();
        const result = await this.generateContentDocs();
        this.docgeni.logger.succuss(`Docs compiled successfully`);
        return result;
        // const result = vfs
        //     .src(`${this.docgeni.paths.absDocsPath}/**`, {})
        //     .pipe(
        //         through2.obj((chunk: vinyl.BufferFile, enc, callback) => {
        //             // console.log(chunk.inspect());
        //             // console.log(JSON.stringify(chunk, null, 2));
        //             console.log(`path: ${chunk.path}`);
        //             console.log(`dirname: ${chunk.dirname}`);
        //             console.log(`extname: ${chunk.extname}`);
        //             console.log(`relative: ${chunk.relative}`);

        //             if (chunk.isBuffer()) {
        //                 console.log(chunk.contents.toString());
        //             }

        //             for (let i = 0; i < chunk.length; i++) {
        //                 if (chunk[i] === 97) {
        //                     chunk[i] = 122; // swap 'a' for 'z'
        //                 }
        //             }

        //             // this.push(chunk);

        //             callback();
        //         })
        //     )
        //     .pipe(vfs.dest('./dist/docs'));

        // result
        //     .on('data', chunk => {
        //         // console.log('data', chunk);
        //     })
        //     .on('end', () => {
        //         console.log('end');
        //     });
    }

    private async setDocsNavInsertIndex() {
        let docsNavInsertIndex = this.docgeni.config.navs.indexOf(null);
        if (docsNavInsertIndex >= 0) {
            this.docgeni.config.navs = this.docgeni.config.navs.filter(item => {
                return !!item;
            });
        } else {
            docsNavInsertIndex = this.docgeni.config.navs.length;
        }
        this.docsNavInsertIndex = docsNavInsertIndex;
    }

    private async generateContentDocs() {
        const localeKeys = this.config.locales.map(locale => {
            return locale.key;
        });

        for (const locale of this.config.locales) {
            const isDefaultLocale = locale.key === this.config.defaultLocale;
            const localeDocsPath = isDefaultLocale
                ? this.docgeni.paths.absDocsPath
                : path.resolve(this.docgeni.paths.absDocsPath, locale.key);
            if (await toolkit.fs.pathExists(localeDocsPath)) {
                const result = await this.generateDirContentDocs(localeDocsPath, locale.key, undefined, isDefaultLocale ? localeKeys : []);
                // this.localesNavsMap[locale.key].splice(this.docsNavInsertIndex, 0, ...result.navs);
                this.localesDocsDataMap[locale.key] = {
                    navs: result.navs,
                    homeMeta: result.categoryMeta
                };
            }
        }
        return this.localesDocsDataMap;
    }

    private async generateDirContentDocs(dirPath: string, locale: string, parentNav?: NavigationItem, excludeDirs?: string[]) {
        const dirsAndFiles = await toolkit.fs.getDirsAndFiles(dirPath, {
            exclude: excludeDirs
        });
        const navOrdersMap: WeakMap<NavigationItem, number> = new WeakMap();
        let navs: Array<NavigationItem> = [];
        let categoryMeta: CategoryDocMeta = null;
        for (const docPath of dirsAndFiles) {
            const fullDocPath = path.resolve(dirPath, docPath);
            if (toolkit.fs.isDirectory(fullDocPath)) {
                const category: NavigationItem = {
                    id: docPath,
                    path: docPath,
                    fullPath: combineRoutePath(parentNav && parentNav.path, docPath),
                    title: toolkit.strings.pascalCase(docPath),
                    subtitle: '',
                    items: []
                };

                navs.push(category);
                const result = await this.generateDirContentDocs(fullDocPath, locale, category);
                category.items = result.navs;
                let order = Number.MAX_SAFE_INTEGER;
                if (result.categoryMeta) {
                    category.title = result.categoryMeta.title;
                    if (result.categoryMeta.path) {
                        category.path = result.categoryMeta.path;
                    }
                    if (toolkit.utils.isNumber(result.categoryMeta.order)) {
                        order = result.categoryMeta.order;
                    }
                }
                navOrdersMap.set(category, order);
            } else {
                const docDestAssetsContentPath = dirPath.replace(
                    this.docgeni.paths.absDocsPath,
                    this.docgeni.paths.absSiteAssetsContentDocsPath
                );
                const { docSourceFile, docDestPath, filename } = await this.generateContentDoc(fullDocPath, docDestAssetsContentPath);

                const isEntry = isEntryDoc(docSourceFile.basename);
                if (!parentNav) {
                    // do nothings
                } else {
                    if (isEntry) {
                        categoryMeta = docSourceFile.result.meta;
                    }
                    const docRoutePath = getDocRoutePath(docSourceFile.result.meta.path, docSourceFile.basename);
                    const docItem: ComponentDocItem = {
                        id: docSourceFile.basename,
                        path: docRoutePath,
                        fullPath: combineRoutePath(parentNav && parentNav.path, docRoutePath),
                        title: getDocTitle(docSourceFile.result.meta.title, docSourceFile.basename),
                        subtitle: ''
                    };
                    let docItemOrder = Number.MAX_SAFE_INTEGER;

                    if (isEntry) {
                        // sort default doc at top
                        if (docSourceFile.content) {
                            docItemOrder = Number.MIN_SAFE_INTEGER;
                        } else {
                            // do nothings when entry doc has not content
                            continue;
                        }
                    } else {
                        if (toolkit.utils.isNumber(docSourceFile.result.meta.order)) {
                            docItemOrder = docSourceFile.result.meta.order;
                        }
                    }

                    navOrdersMap.set(docItem, docItemOrder);
                    const contentPath = docDestPath.replace(this.docgeni.paths.absSiteAssetsContentPath, '');
                    docItem.contentPath = contentPath;
                    navs.push(docItem);
                }
            }
        }
        navs = toolkit.utils.sortByOrderMap(navs, navOrdersMap);
        return { navs, categoryMeta };
    }

    private async generateContentDoc(absDocPath: string, absDestDirPath: string, docType: DocType = DocType.general) {
        const content = await toolkit.fs.readFile(absDocPath, 'UTF-8');
        const docSourceFile = createDocSourceFile(absDocPath, content, docType);
        this.docgeni.hooks.docCompile.call(docSourceFile);
        const filename = docSourceFile.basename + docSourceFile.ext;
        const docDestPath = path.resolve(absDestDirPath, filename);
        await toolkit.fs.ensureDir(absDestDirPath);
        await toolkit.fs.outputFile(docDestPath, docSourceFile.result.html, { encoding: 'UTF-8' });
        return { docSourceFile, docDestPath, filename };
    }
}
