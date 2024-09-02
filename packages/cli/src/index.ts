import * as yargs from 'yargs';
import { buildCommand } from './build';
import { serveCommand } from './serve';
import { DEFAULT_CONFIG } from '@docgeni/core';
import { initCommand } from './init';

async function main() {
    const argv = await yargs
        .scriptName('docgeni')
        .usage('Usage: $0 <build|dev|init> [options]')
        .option('docs-dir', {
            desc: `Docs dir`
        })
        .command(buildCommand)
        .command(serveCommand)
        .command(initCommand)
        .demandCommand(1, 'must provide a valid command')
        .detectLocale(false)
        .wrap(120)
        .version()
        .showHelpOnFail(false)
        .help().argv;

    const command = argv._[0] as string;
    if (command && !['build', 'dev', 'serve', 'init', ''].includes(command)) {
        yargs.showHelp();
    }
}

main();
