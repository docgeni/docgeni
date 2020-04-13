import { CommandModule } from 'yargs';
import { Docgeni, DocgeniConfig } from '@docgeni/core';

export const buildCommand: CommandModule = {
    command: ['build'],
    describe: 'Build documentation site',
    builder: yargs => {
        yargs.option('skip', {
            alias: 's',
            // choices: ['bump', 'changelog', 'commit', 'branch', 'push'],
            desc: `Map of steps in the release process that should be skipped`,
            default: 0
        });

        return yargs;
    },
    handler: async (argv: any) => {
        const config = argv as DocgeniConfig;

        const docgeni = new Docgeni({});
        docgeni.run(config);
    }
};
