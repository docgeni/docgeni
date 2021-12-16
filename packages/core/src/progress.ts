import { Spinner, toolkit, colors } from '@docgeni/toolkit';
import { DocgeniContext } from './docgeni.interface';
import textTable from 'text-table';
import { CompilationResult } from './types';
import ansiColors from 'ansi-colors';
import { getSummaryStr } from './utils';

export function removeColor(text: string): string {
    // This has been created because when colors.enabled is false unstyle doesn't work
    // see: https://github.com/doowb/ansi-colors/blob/a4794363369d7b4d1872d248fc43a12761640d8e/index.js#L38
    return text.replace(ansiColors.ansiRegex, '');
}

export class DocgeniProgress extends Spinner {
    name = 'DocgeniProgress';

    constructor(private docgeni: DocgeniContext) {
        super();
    }

    initialize() {
        let originalLog: (message: string) => void;
        this.docgeni.hooks.compilation.tap('DocgeniProgress', compilation => {
            if (!this.isSpinning) {
                this.start('\nStart building...');
            }
            originalLog = this.docgeni.logger.log;
            this.docgeni.logger.log = message => {
                this.info(message);
            };
            const startTime = new Date().getTime();
            let currentDoc = 0;
            let totalDoc = 0;
            let totalComponent = 0;
            let currentComponent = 0;

            compilation.hooks.docsBuild.tap(this.name, (docsBuilder, docs) => {
                totalDoc = docs.length;
                this.text = 'Start building docs...';
            });

            compilation.hooks.docsBuildSucceed.tap(this.name, builder => {
                this.text = `Build docs successfully(total: ${totalDoc})`;
            });

            compilation.hooks.docBuildSucceed.tap(this.name, docFile => {
                this.text = `Building docs (${++currentDoc}/${totalDoc}) ${getSummaryStr(docFile.path)}`;
            });

            compilation.hooks.libraryBuild.tap(this.name, lib => {
                totalComponent += lib.components.size;
                this.text = `Start building library(${lib.lib.name})...`;
            });

            compilation.hooks.libraryBuildSucceed.tap(this.name, (lib, components) => {
                totalComponent += lib.components.size;
                this.text = `Library(${lib.lib.name}) build successfully(total: ${components ? components.length : lib.components.size})`;
            });

            compilation.hooks.componentBuildSucceed.tap(this.name, component => {
                this.text = `Building components ${++currentComponent}/${totalComponent} ${getSummaryStr(component.absPath)}`;
            });

            compilation.hooks.finish.tap(this.name, () => {
                this.stop();
                this.docgeni.logger.log = originalLog;
                if (compilation.increment && compilation.increment.changes) {
                    this.docgeni.logger.fancy(`\n${compilation.increment.changes.length} files changes\n`);
                }
                const finishTime = new Date().getTime();
                const result = compilation.getResult();
                this.docgeni.logger.fancy(this.toStringByCompilationResult(result, finishTime - startTime));
                this.succeed('Docgeni compiled successfully.');
            });
        });
    }

    private getEmitFilesCount(emits: CompilationResult) {
        return Object.keys(emits.componentFiles).length + emits.docs.length + Object.keys(emits.files).length;
    }

    private toStringByCompilationResult(emits: CompilationResult, time: number) {
        const table = textTable(
            [
                ['Module Name', 'Emit Count'].map(item => {
                    return colors.bold(item);
                }),
                ['Docs', colors.green(emits.docs.length)],
                ['Components', colors.green(emits.components.length)],
                ['Total Emit Files', colors.green(this.getEmitFilesCount(emits))]
                // ['Total', colors.green(result.docs.length + result.components.length)]
            ],
            { align: ['l', 'l'], hsep: toolkit.print.chalk.gray(' | '), stringLength: s => removeColor(s).length }
        );

        const info = [
            ['Build at', toolkit.utils.timestamp(`YYYY/MM/DD HH:mm:ss`)],
            ['Time', `${time}ms`],
            ['Version', this.docgeni.version]
        ]
            .map(item => {
                return `${item[0]}: ${colors.bold(item[1])}`;
            })
            .join(' - ');
        return `${table}\n\n${info}\n`;
    }
}
