import { AngularCommandOptions } from '@docgeni/core';
import { strings } from '@angular-devkit/core';
import { Option } from '@angular/cli/models/interface';
export function normalizeCommandArgsForAngular(args: any, list: Option[]): AngularCommandOptions {
    return Object.keys(args)
        .filter(key => getOptionFromName(key, list))
        .reduce((pre, cur: string) => {
            pre[cur] = args[cur];
            return pre;
        }, {});
}

function getOptionFromName(name: string, options) {
    const camelName = /(-|_)/.test(name) ? strings.camelize(name) : name;
    for (const option of options) {
        if (option.name === name || option.name === camelName) {
            return true;
        }
        if (option.aliases.some(x => x === name || x === camelName)) {
            return true;
        }
    }
    return false;
}
