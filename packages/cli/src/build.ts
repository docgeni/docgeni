import { CommandModule } from 'yargs';
import { Docgeni, DocgeniConfig, readNgBuildOptions } from '@docgeni/core';
import { getConfiguration } from './configuration';
import { yargsOptionsGenerate } from './util/yargs-options-generate';
import { VERSION } from './version';

export const buildCommand: CommandModule = {
    command: ['build'],
    describe: 'Build documentation site',
    builder: yargs => {
        yargsOptionsGenerate(yargs, readNgBuildOptions())
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
            version: VERSION
        });
        await docgeni.run();
    }
};
