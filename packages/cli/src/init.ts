import { CommandModule } from 'yargs';
import { toolkit } from '@docgeni/toolkit';
import { spawn } from 'child_process';
export const initCommand: CommandModule = {
    command: ['init'],
    describe: 'Init config',
    builder: yargs => {
        yargs.option('mode', {
            alias: 'm',
            desc: `Mode of documentation, full mode contains nav, home page, lite mode only contains menu and doc viewers`,
            boolean: false
        });

        return yargs;
    },
    handler: async argv => {
        const child = spawn(`npx`, [`schematics`, `@docgeni/cli:ng-add`, `--mode`, `${argv.mode}`, `--docsPath`, `${argv.docsPath}`], {
            stdio: 'inherit',
            shell: process.platform === 'win32'
        });
        child.on('data', data => {
            toolkit.print.info(data);
        });
        child.on('error', data => {
            toolkit.print.error(data);
        });
    }
};
