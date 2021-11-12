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

const EXTRA_NG_OPTIONS = {
    configuration: {
        name: 'configuration',
        description:
            'One or more named builder configurations as a comma-separated list as specified in the "configurations" section of angular.json.\nThe builder uses the named configurations to run the given target.\nFor more information, see https://angular.io/guide/workspace-config#alternate-build-configurations.\nSetting this explicitly overrides the "--prod" flag.',
        type: NgOptionType.String,
        aliases: ['c']
    },
    prod: {
        name: 'prod',
        description: 'Target to build.',
        type: NgOptionType.Boolean,
        required: false,
        aliases: []
    },
    port: {
        name: 'port',
        description: 'Target to build.',
        type: NgOptionType.String,
        required: false,
        aliases: []
    }
};

export function readNgBuildOptions(): NgOption[] {
    return toolkit.fs.readJSONSync(path.resolve(__dirname, './ng-build-options.json'));
}

export function readNgServeOptions() {
    return toolkit.fs.readJSONSync(path.resolve(__dirname, './ng-serve-options.json'));
}

export function extractAngularCommandArgs(argv: any, options: NgOption[]): Record<string, string> {
    const optionsNameMap = toolkit.utils.keyBy(options, 'name');
    Object.assign(optionsNameMap, EXTRA_NG_OPTIONS);
    return Object.keys(argv)
        .filter(key => {
            return optionsNameMap[key] || optionsNameMap[toolkit.strings.camelCase(key)];
        })
        .reduce((result, item) => {
            result[toolkit.strings.paramCase(item)] = argv[item];
            return result;
        }, {});
}
