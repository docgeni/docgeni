import { NgOptionType, NgOption } from '@docgeni/core';
import yargs from 'yargs';

export function yargsOptionsGenerate(yargs: yargs.Argv<{}>, list: NgOption[]) {
    list = list.slice();

    while (list.length) {
        const item = list.pop();
        yargs = yargs.option(item.name, {
            alias: item.aliases,
            array: item.type === NgOptionType.Array,
            boolean: item.type === NgOptionType.Boolean,
            description: item.description,
            demandOption: item.required,
            type: item.type !== NgOptionType.Any && item.type !== NgOptionType.Array ? item.type : undefined
        });
    }
    return yargs;
}
