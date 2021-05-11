import { Option, OptionType } from '@angular/cli/models/interface';
import yargs from 'yargs';

export function yargsOptionsGenerate(yargs: yargs.Argv<{}>, list: Option[]) {
    list = list.slice();

    while (list.length) {
        const item = list.pop();
        yargs = yargs.option(item.name, {
            alias: item.aliases,
            array: item.type === OptionType.Array,
            boolean: item.type === OptionType.Boolean,
            description: item.description,
            demandOption: item.required,
            type: item.type !== OptionType.Any && item.type !== OptionType.Array ? item.type : undefined
        });
    }
    return yargs;
}
