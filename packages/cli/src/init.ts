import { CommandModule } from 'yargs';
import { main } from '@angular-devkit/schematics-cli/bin/schematics';
export const initCommand: CommandModule = {
    command: ['init', '$0'],
    describe: 'Init config',
    builder: (yargs) => {
        yargs.option('mode', {
            alias: 'm',
            desc: `Mode of documentation, full mode contains nav, home page, lite mode only contains menu and doc viewers`,
            choices: ['lite', 'full'],
        });

        return yargs;
    },
    handler: async (argv) => {
        const params: string[] = [];
        if (argv.mode) {
            params.push('--mode', `${argv.mode}`);
        }
        if (argv.docsDir) {
            params.push(`--docsDir`, `${argv.docsDir}`);
        }
        main({ args: [`@docgeni/cli:ng-add`, ...params] })
            .then((exitCode) => (process.exitCode = exitCode))
            .catch((e) => {
                throw e;
            });
    },
};
