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
        if (this.options.tsConfigPath) {
            const parsedResult = ts.getParsedCommandLineOfConfigFile(this.options.tsConfigPath, undefined, {
                useCaseSensitiveFileNames: true,
                fileExists: path => {
                    return ts.sys.fileExists(path);
                },
                readFile: path => {
                    return ts.sys.readFile(path);
                },
                getCurrentDirectory: () => {
                    return ts.sys.getCurrentDirectory();
                },
                readDirectory: (path, extensions, excludes, includes, depth) => {
                    return ts.sys.readDirectory(path, extensions, excludes, includes, depth);
                },
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
        if (this.options.rootDir) {
            this.rootDir = toolkit.utils.normalizeSlashes(this.options.rootDir);
            debug(`rootDir is ${this.rootDir} from ${this.options.rootDir}`, 'ng-parser');
        }
    }

    private watchResolvedModules() {
        if (!this.options.watch) {
            return;
        }
        const allResolvedModulesMap = new Map<string, boolean>();
        this.allResolvedModules.map(resolvedModule => {
            allResolvedModulesMap.set(resolvedModule.resolvedFileName, true);
            if (this.moduleWatchersMap.get(resolvedModule.resolvedFileName)) {
                return;
            }
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
        const sourceText = ts.sys.readFile(fileName);
        return sourceText !== undefined ? ts.createSourceFile(fileName, sourceText, languageVersion) : undefined;
    }

    private createCompilerHost(): ts.CompilerHost {
        return {
            getSourceFile: this.getSourceFile.bind(this),
            getDefaultLibFileName: () => '',
            writeFile: (fileName, content) => {
                return ts.sys.writeFile(fileName, content);
            },
            getCurrentDirectory: () => {
                const result = ts.sys.getCurrentDirectory();
                debug(`getCurrentDirectory is ${result}`, 'ng-parser');
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
            fileExists: filename => {
                return ts.sys.fileExists(filename);
            },
            readFile: filename => {
                return ts.sys.readFile(filename);
            },
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
                fileExists: ts.sys.fileExists,
                readFile: ts.sys.readFile
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
