import { CommandModule } from 'yargs';
import { DocgConfig, DEFAULT_CONFIG } from '../interfaces';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import watch from 'gulp-watch';
import path from 'path';
import { execSync, exec } from 'child_process';

export const serveCommand: CommandModule = {
    command: ['serve'],
    describe: 'Serve documentation site for development',
    builder: yargs => {
        yargs.option('docs-folder', {
            desc: `Docs folder path`,
            default: DEFAULT_CONFIG.docsFolder
        });

        return yargs;
    },
    handler: async (argv: any) => {
        const config = argv as DocgConfig;

        if (!fs.existsSync(config.docsFolder)) {
            throw new Error(`docs folder(${config.docsFolder}) has not exists`);
        }

        const docsFolderAbsolutePath = path.resolve(process.cwd(), config.docsFolder);
        const docsContentAbsolutePath = path.resolve(process.cwd(), 'packages/site/src/app/docs-content');
        const docsAbsolutePath = path.resolve(docsContentAbsolutePath, 'docs');

        fs.copySync(config.docsFolder, docsAbsolutePath);

        watch(config.docsFolder, file => {
            const destPath = file.path.replace(docsFolderAbsolutePath, docsAbsolutePath);
            if (file.event === 'change' || file.event === 'add') {
                fs.copyFileSync(file.path, destPath);
            } else {
                throw new Error(`watch folder event: ${file.event} is not support`);
            }
        });

        execSync('npm run start', { stdio: 'inherit' });
        // const watcher = chokidar.watch(config.docsFolder, {});
        // watcher.on('change', (path, stats) => {
        //     console.log(stats);
        // });
    }
};
