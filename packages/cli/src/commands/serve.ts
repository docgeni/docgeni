import { CommandModule } from 'yargs';
import { DocgeniConfig, DEFAULT_CONFIG, Library } from '../interfaces';
import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import * as watch from 'gulp-watch';
import * as path from 'path';
import { Builder } from '../builder';

export const serveCommand: CommandModule = {
    command: ['serve'],
    describe: 'Serve documentation site for development',
    builder: yargs => {
        yargs.option('docs-folder', {
            desc: `Docs folder path`,
            default: DEFAULT_CONFIG.docsPath
        });

        return yargs;
    },
    handler: async (argv: any) => {
        const config = argv as DocgeniConfig;

        const builder = new Builder({
            watch: true
        });

        builder.run(config);

        // if (!fs.existsSync(config.docsPath)) {
        //     throw new Error(`docs folder(${config.docsPath}) has not exists`);
        // }

        // const docsFolderAbsolutePath = path.resolve(process.cwd(), config.docsPath);
        // const docsContentAbsolutePath = path.resolve(process.cwd(), 'packages/site/src/app/docs-content');
        // const docsAbsolutePath = path.resolve(docsContentAbsolutePath, 'docs');

        // // fs.ensureDirSync(docsAbsolutePath);
        // fs.copySync(config.docsPath, docsAbsolutePath);

        // watch(config.docsPath, file => {
        //     const destPath = file.path.replace(docsFolderAbsolutePath, docsAbsolutePath);
        //     if (file.event === 'change' || file.event === 'add') {
        //         fs.copyFileSync(file.path, destPath);
        //     } else {
        //         throw new Error(`watch folder event: ${file.event} is not support`);
        //     }
        // });

        // if (config.libs) {
        //     config.libs.forEach(lib => {});
        // }

        // execSync('npm run start', { stdio: 'inherit' });
        // const watcher = chokidar.watch(config.docsFolder, {});
        // watcher.on('change', (path, stats) => {
        //     console.log(stats);
        // });
    }
};

// async function syncLib(lib: Library) {
//     const libAbsolutePath = path.resolve(process.cwd(), lib.root);
//     const components = await fs.readdir(libAbsolutePath);
//     console.log(components);
//     const libDestAbsolutePath = path.resolve(docsContentAbsolutePath, `${lib.name}`);
//     fs.copySync(libAbsolutePath, libDestAbsolutePath);
// }
