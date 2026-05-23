import { cosmiconfigSync, OptionsSync } from 'cosmiconfig';
import { DocgeniConfig } from '@docgeni/core';
import * as fs from 'fs';
import * as path from 'path';

const moduleName = 'docgeni';

const searchPlaces = [
    'package.json',
    `.${moduleName}rc`,
    `.${moduleName}rc.json`,
    `.${moduleName}rc.yaml`,
    `.${moduleName}rc.yml`,
    `.${moduleName}rc.ts`,
    `.${moduleName}rc.js`,
    `.config/${moduleName}rc.ts`,
    `.config/${moduleName}rc.js`,
    `${moduleName}.config.ts`,
    `${moduleName}.config.js`,
];

function loadTypeScript(filepath: string, content: string) {
    let typescript: typeof import('typescript');
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        typescript = require('typescript');
    } catch {
        throw new Error(`[docgeni] TypeScript is required to load ${filepath}. Please install typescript in your project.`);
    }

    const compiledFilepath = `${filepath.slice(0, -2)}cjs`;
    try {
        const tsconfigPath = typescript.findConfigFile(path.dirname(filepath), typescript.sys.fileExists);
        let compilerOptions: import('typescript').CompilerOptions = {
            module: typescript.ModuleKind.CommonJS,
            target: typescript.ScriptTarget.ES2022,
        };
        if (tsconfigPath) {
            const { config, error } = typescript.readConfigFile(tsconfigPath, typescript.sys.readFile);
            if (error) {
                throw new Error(`Error in ${tsconfigPath}: ${error.messageText.toString()}`);
            }
            const parsedConfig = typescript.parseJsonConfigFileContent(config, typescript.sys, path.dirname(tsconfigPath));
            compilerOptions = {
                ...parsedConfig.options,
                module: typescript.ModuleKind.CommonJS,
                target: typescript.ScriptTarget.ES2022,
            };
        }
        const output = typescript.transpileModule(content, {
            compilerOptions,
            fileName: filepath,
        }).outputText;
        fs.writeFileSync(compiledFilepath, output);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const result = require(compiledFilepath);
        return result?.default ?? result;
    } catch (error) {
        if (error instanceof Error) {
            error.message = `TypeScript Error in ${filepath}:\n${error.message}`;
        }
        throw error;
    } finally {
        if (fs.existsSync(compiledFilepath)) {
            fs.rmSync(compiledFilepath);
        }
    }
}

function getDefaultLoaders() {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const cosmiconfig = require('cosmiconfig');
    const loaders = cosmiconfig.defaultLoadersSync ?? cosmiconfig.defaultLoaders;
    return {
        ...loaders,
        '.ts': loadTypeScript,
    };
}

export function getConfiguration(options?: Partial<OptionsSync>): Partial<DocgeniConfig> {
    const { loaders: customLoaders, ...restOptions } = options ?? {};
    const exploreSync = cosmiconfigSync(moduleName, {
        searchPlaces,
        loaders: {
            ...getDefaultLoaders(),
            ...customLoaders,
        },
        ...restOptions,
    });
    const result = exploreSync.search();

    if (result && !result.isEmpty) {
        if (!result.config || typeof result.config !== 'object') {
            throw Error(
                `[docgeni] Invalid configuration in ${searchPlaces.join(',')} provided. Expected an object but found ${typeof result.config}.`,
            );
        }
        return result.config;
    } else {
        // don't throw error when rc file has not exists.
        return {};
    }
}
