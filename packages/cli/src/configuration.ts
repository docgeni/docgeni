import { cosmiconfigSync, OptionsSync } from 'cosmiconfig';
import { DocgeniConfig } from './interfaces';

const moduleName = 'docgeni';
const searchPlaces = [
    'package.json',
    `.${moduleName}rc`,
    `.${moduleName}rc.json`,
    `.${moduleName}rc.yaml`,
    `.${moduleName}rc.yml`,
    `.${moduleName}rc.js`,
    `${moduleName}.config.js`
];

export function getConfiguration(options?: OptionsSync): Partial<DocgeniConfig> {
    const exploreSync = cosmiconfigSync(moduleName, options);
    const result = exploreSync.search();

    if (result && !result.isEmpty) {
        if (!result.config || typeof result.config !== 'object') {
            throw Error(
                `[docgeni] Invalid configuration in ${searchPlaces.join(
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
