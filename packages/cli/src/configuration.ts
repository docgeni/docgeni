import { cosmiconfigSync, OptionsSync } from 'cosmiconfig';
import { DocgConfig } from './interfaces';

const moduleName = 'docg';
const searchPlaces = [
    'package.json',
    `.${moduleName}rc`,
    `.${moduleName}rc.json`,
    `.${moduleName}rc.yaml`,
    `.${moduleName}rc.yml`,
    `.${moduleName}rc.js`,
    `${moduleName}.config.js`
];

export function getConfiguration(options?: OptionsSync): Partial<DocgConfig> {
    const exploreSync = cosmiconfigSync(moduleName, options);
    const result = exploreSync.search();

    if (result && !result.isEmpty) {
        if (!result.config || typeof result.config !== 'object') {
            throw Error(
                `[docgen] Invalid configuration in ${searchPlaces.join(
                    ','
                )} provided. Expected an object but found ${typeof result.config}.`
            );
        }
        return result.config;
    } else {
        // don't throw error when rc file has not exists.
        return {};
    }
}
