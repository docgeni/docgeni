import { CommandModule } from 'yargs';
import { Docgeni, DocgeniConfig } from '@docgeni/core';
import { normalizeCommandArgsForAngular } from './angular-args';
import { getConfiguration } from './configuration';

export const buildCommand: CommandModule = {
    command: ['build'],
    describe: 'Build documentation site',
    builder: yargs => {
        yargs
            .option('watch', {
                alias: 'w',
                desc: `Watch`,
                boolean: true,
                default: false
            })
            .option('prod', {
                desc: `Production`,
                boolean: true,
                default: false
            })
            .option('skip-site', {
                desc: `skip build site`,
                boolean: true,
                default: false
            })
            .option('siteProjectName', {
                desc: `Site project name`,
                default: ''
            })
            .config(getConfiguration())
            .pkgConf('docgeni');

        return yargs;
    },
    handler: async (argv: any) => {
        const config = argv as DocgeniConfig;
        const docgeni = new Docgeni({
            watch: argv.watch,
            config,
            cmdArgs: normalizeCommandArgsForAngular(config)
        });
        docgeni.run();
    }
};
