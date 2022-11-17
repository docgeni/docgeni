import { toolkit, debug } from '@docgeni/toolkit';
import { FSWatcher } from 'fs';
import { ts } from './typescript';

export interface NgParserHost {
    program: ts.Program;
}
export interface DefaultNgParserHostOptions {
    tsConfigPath?: string;
    fileGlobs?: string;
    rootDir?: string;
    watch?: boolean;
    watcher?: (event: string, filename: string) => void;
    fsHost?: {
        fileExists: (path: string) => boolean;
        readFile: (path: string) => string;
        writeFile: (path: string, data: string, writeByteOrderMark?: boolean) => void;
        readDirectory: (
            rootDir: string,
            extensions: readonly string[],
            excludes: readonly string[] | undefined,
            includes: readonly string[],
            depth?: number
        ) => readonly string[];
    };
}

export class DefaultNgParserHost implements NgParserHost {
    private rootFileNames: string[] = [];
    private compileOptions: ts.CompilerOptions;
    private tsProgram: ts.Program;
    private allResolvedModules: ts.ResolvedModule[] = [];
    private moduleWatchersMap = new Map<string, FSWatcher>();
    private readFiles: string[] = [];
    private rootDir: string;

    static create(options: DefaultNgParserHostOptions): NgParserHost {
        return new DefaultNgParserHost(options);
    }

    public get program() {
        if (!this.tsProgram) {
            this.tsProgram = this.createProgram();
        }
        return this.tsProgram;
    }

    constructor(private options: DefaultNgParserHostOptions) {
        this.initialize();
    }

    private createProgram() {
        const program = ts.createProgram(
            this.rootFileNames,
            { ...this.compileOptions, types: [] },
            this.tsProgram ? undefined : this.createCompilerHost(),
            this.tsProgram
        );
        debug(`Program created, sourceFiles count: ${program.getSourceFiles().length}`, 'ng-parser');
        this.watchResolvedModules();
        return program;
    }

    private initialize() {
        if (!this.options.fsHost) {
            this.options.fsHost = {
                fileExists: path => {
                    return ts.sys.fileExists(path);
                },
                readFile: path => {
                    return ts.sys.readFile(path);
                },
                writeFile: (fileName, content) => {
                    return ts.sys.writeFile(fileName, content);
                },
                readDirectory: (path, extensions, excludes, includes, depth) => {
                    return ts.sys.readDirectory(path, extensions, excludes, includes, depth);
                }
            };
        }
        if (this.options.tsConfigPath) {
            const tsConfigPath = toolkit.utils.getSystemPath(this.options.tsConfigPath);
            const parsedResult = ts.getParsedCommandLineOfConfigFile(tsConfigPath, undefined, {
                useCaseSensitiveFileNames: true,
                fileExists: this.options.fsHost.fileExists,
                readFile: this.options.fsHost.readFile,
                getCurrentDirectory: () => {
                    const currentDirectory = ts.sys.getCurrentDirectory();
                    debug(`getParsedCommandLineOfConfigFile currentDirectory is ${currentDirectory}`, 'ng-parser');
                    return currentDirectory;
                },
                readDirectory: this.options.fsHost.readDirectory,
                onUnRecoverableConfigFileDiagnostic: () => {}
            });
            if (parsedResult) {
                this.rootFileNames = parsedResult.fileNames;
                this.compileOptions = parsedResult.options;
                debug(`ConfigFile parsed rootFileNames is ${JSON.stringify(this.rootFileNames, null, 2)}`, 'ng-parser');
            }
        } else {
            this.rootFileNames = toolkit.fs.globSync(this.options.fileGlobs);
            this.compileOptions = {};
        }
        debug(`rootFileNames is ${this.rootFileNames}`, 'ng-parser');
        this.rootFileNames.forEach(fileName => {
            this.allResolvedModules.push({ resolvedFileName: fileName });
        });
        if (this.options.rootDir) {
            this.rootDir = toolkit.path.getTSSystemPath(this.options.rootDir);
            debug(`rootDir is ${this.rootDir} from ${this.options.rootDir}`, 'ng-parser');
        }
    }

    private watchResolvedModules() {
        if (!this.options.watch) {
            return;
        }
        debug(`start watch resolvedModules, allResolvedModules: ${this.allResolvedModules.length}`, 'ng-parser');
        const allResolvedModulesMap = new Map<string, boolean>();
        this.allResolvedModules.map(resolvedModule => {
            debug(`start resolvedModule: ${resolvedModule.resolvedFileName}, rootDir: ${this.rootDir}`, 'ng-parser');
            // ignore duplicate module, we will add rootFileNames to allResolvedModules at initialization
            if (allResolvedModulesMap.has(resolvedModule.resolvedFileName)) {
                return;
            }
            allResolvedModulesMap.set(resolvedModule.resolvedFileName, true);
            // Note: only watch resolved modules in rootDir and exclude others e.g. node_modules, otherwise it will trigger build many builds for the first time
            // In fact, it is correct to only monitor the source code of library
            // see https://github.com/docgeni/docgeni/issues/359
            if (this.moduleWatchersMap.get(resolvedModule.resolvedFileName) || !resolvedModule.resolvedFileName.includes(this.rootDir)) {
                return;
            }
            // Note: ignore json file, it will always trigger watch callback event for json file
            // see https://github.com/docgeni/docgeni/issues/364
            if (resolvedModule.resolvedFileName.endsWith('.json')) {
                return;
            }
            debug(`watch resolvedModule: ${resolvedModule.resolvedFileName}`, 'ng-parser');
            const watcher = toolkit.fs.watch(resolvedModule.resolvedFileName, { persistent: true }, (event: string, filename: string) => {
                this.tsProgram = this.createProgram();
                this.options.watcher(event, resolvedModule.resolvedFileName);
            });
            this.moduleWatchersMap.set(resolvedModule.resolvedFileName, watcher);
        });
        for (const [key, watcher] of this.moduleWatchersMap.entries()) {
            if (!allResolvedModulesMap.has(key)) {
                watcher.removeAllListeners();
                this.moduleWatchersMap.delete(key);
            }
        }
    }

    private getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: (message: string) => void) {
        this.readFiles.push(fileName);
        const sourceText = this.options.fsHost.readFile(fileName);
        return sourceText !== undefined ? ts.createSourceFile(fileName, sourceText, languageVersion) : undefined;
    }

    private createCompilerHost(): ts.CompilerHost {
        return {
            getSourceFile: this.getSourceFile.bind(this),
            getDefaultLibFileName: () => '',
            writeFile: this.options.fsHost.writeFile,
            getCurrentDirectory: () => {
                const result = ts.sys.getCurrentDirectory();
                debug(`createCompilerHost currentDirectory is ${result}`, 'ng-parser');
                return result;
            },
            getDirectories: path => {
                return ts.sys.getDirectories(path);
            },
            getCanonicalFileName: fileName => (ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase()),
            getNewLine: () => ts.sys.newLine,
            useCaseSensitiveFileNames: () => {
                return ts.sys.useCaseSensitiveFileNames;
            },
            fileExists: this.options.fsHost.fileExists,
            readFile: this.options.fsHost.readFile,
            resolveModuleNames: this.resolveModuleNames.bind(this),
            directoryExists: dirPath => {
                return ts.sys.directoryExists(dirPath);
            }
        };
    }

    private resolveModuleNames(moduleNames: string[], containingFile: string): ts.ResolvedModule[] {
        const resolvedModules: ts.ResolvedModule[] = [];
        for (const moduleName of moduleNames) {
            // try to use standard resolution
            const result = ts.resolveModuleName(moduleName, containingFile, this.compileOptions, {
                fileExists: this.options.fsHost.fileExists,
                readFile: this.options.fsHost.readFile
            });
            if (result.resolvedModule) {
                this.allResolvedModules.push(result.resolvedModule);
                resolvedModules.push(result.resolvedModule);
            } else {
                console.log(`can't resolve ${moduleName}`);
            }
        }
        return resolvedModules;
    }
}

export function createNgParserHost(options: DefaultNgParserHostOptions) {
    return new DefaultNgParserHost(options);
}
