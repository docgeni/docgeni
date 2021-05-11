import { CommandModule } from 'yargs';
import { Docgeni, DocgeniConfig, DEFAULT_CONFIG } from '@docgeni/core';
import { normalizeCommandArgsForAngular } from './angular-args';
import { getConfiguration } from './configuration';
import * as fs from 'fs';
import * as path from 'path';
import { yargsOptionsGenerate } from './util/yargs-options-generate';
import { Option } from '@angular/cli/models/interface';

const ngServeOptions: Option[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, './ng-serve-options.json')).toString());

export const serveCommand: CommandModule = {
    command: ['serve'],
    describe: 'Serve documentation site for development',
    builder: yargs => {
        yargsOptionsGenerate(yargs, ngServeOptions)
            .option('docs-folder', {
                desc: `Docs dir`,
                default: DEFAULT_CONFIG.docsDir
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
            watch: true,
            config,
            cmdArgs: normalizeCommandArgsForAngular(config, ngServeOptions)
        });
        docgeni.run();
    }
};
