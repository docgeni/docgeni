import { toolkit } from '@docgeni/toolkit';
import * as path from 'path';

export enum NgOptionType {
    Any = 'any',
    Array = 'array',
    Boolean = 'boolean',
    Number = 'number',
    String = 'string'
}
/**
 * An option description. This is exposed when using `ng --help=json`.
 */
export interface NgOption {
    /**
     * The name of the option.
     */
    name: string;
    /**
     * A short description of the option.
     */
    description: string;
    /**
     * The type of option value. If multiple types exist, this type will be the first one, and the
     * types array will contain all types accepted.
     */
    type: NgOptionType;
    /**
     * Aliases supported by this option.
     */
    aliases: string[];
    /**
     * Whether this option is required or not.
     */
    required?: boolean;
}

export function readNgBuildOptions(): NgOption[] {
    return toolkit.fs.readJSONSync(path.resolve(__dirname, './ng-build-options.json'));
}

export function readNgServeOptions() {
    return toolkit.fs.readJSONSync(path.resolve(__dirname, './ng-serve-options.json'));
}

export function extractAngularCommandArgs(argv: any, options: NgOption[]): Record<string, string> {
    const optionsNameMap = toolkit.utils.keyBy(options, 'name');
    return Object.keys(argv)
        .filter(key => {
            return optionsNameMap[key] || optionsNameMap[toolkit.strings.camelCase(key)];
        })
        .reduce((result, item) => {
            result[toolkit.strings.paramCase(item)] = argv[item];
            return result;
        }, {});
}
