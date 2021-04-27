import { CommandModule } from 'yargs';
import { Docgeni, DocgeniConfig } from '@docgeni/core';
import { normalizeCommandArgsForAngular } from './angular-args';
import { getConfiguration } from './configuration';
import * as fs from 'fs';
import * as path from 'path';
import { yargsOptionsGenerate } from './util/yargs-options-generate';
import { Option } from '@angular/cli/models/interface';
const ngBuildOptions: Option[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, './ng-build-options.json')).toString());
export const buildCommand: CommandModule = {
    command: ['build'],
    describe: 'Build documentation site',
    builder: yargs => {
        yargsOptionsGenerate(yargs, ngBuildOptions)
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
            cmdArgs: normalizeCommandArgsForAngular(config, ngBuildOptions)
        });
        docgeni.run();
    }
};
