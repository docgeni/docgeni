import { cosmiconfigSync, OptionsSync } from 'cosmiconfig';
import { DocgeniConfig } from '@docgeni/core';

const moduleName = 'docgeni';

export function getConfiguration(options?: Partial<OptionsSync>): Partial<DocgeniConfig> {
    const exploreSync = cosmiconfigSync(moduleName, {
        ...options,
    });
    const result = exploreSync.search();
    if (result && !result.isEmpty) {
        if (!result.config || typeof result.config !== 'object') {
            throw Error(`[docgeni] Invalid configuration provided. Expected an object but found ${typeof result.config}.`);
        }
        return result.config;
    } else {
        // don't throw error when rc file has not exists.
        return {};
    }
}
