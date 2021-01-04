// import { Architect, BuilderInfo, BuilderProgressState, Target } from '@angular-devkit/architect';
// import { WorkspaceNodeModulesArchitectHost } from '@angular-devkit/architect/node';
// import { logging, schema, tags, workspaces } from '@angular-devkit/core';
// import { NodeJsSyncHost, createConsoleLogger } from '@angular-devkit/core/node';
// import * as ansiColors from 'ansi-colors';
// import { existsSync } from 'fs';
// import * as minimist from 'minimist';
// import * as path from 'path';
// import { tap } from 'rxjs/operators';

// function _targetStringFromTarget({ project, target, configuration }: Target) {
//     return `${project}:${target}${configuration !== undefined ? ':' + configuration : ''}`;
// }

// interface BarInfo {
//     status?: string;
//     builder: BuilderInfo;
//     target?: Target;
// }

// // Create a separate instance to prevent unintended global changes to the color configuration
// // Create function is not defined in the typings. See: https://github.com/doowb/ansi-colors/pull/44
// const colors = (ansiColors as typeof ansiColors & { create: () => typeof ansiColors }).create();

// async function _executeTarget(
//     target:string,
//     parentLogger: logging.Logger,
//     workspace: workspaces.WorkspaceDefinition,
//     root: string,

//     registry: schema.SchemaRegistry
// ) {
//     const architectHost = new WorkspaceNodeModulesArchitectHost(workspace, root);
//     const architect = new Architect(architectHost, registry);

//     // Split a target into its parts.
//     const targetStr = argv._.shift() || '';
//     const [project, target, configuration] = targetStr.split(':');
//     const targetSpec = { project, target, configuration };

//     const logger = new logging.Logger('jobs');
//     const logs: logging.LogEntry[] = [];
//     logger.subscribe(entry => logs.push({ ...entry, message: `${entry.name}: ` + entry.message }));

//     const { _, ...options } = argv;
//     const run = await architect.scheduleTarget(targetSpec, options, { logger });
//     // const bars = new MultiProgressBar<number, BarInfo>(':name :bar (:current/:total) :status');

//     run.progress.subscribe(update => {
//         // const data = bars.get(update.id) || {
//         //     id: update.id,
//         //     builder: update.builder,
//         //     target: update.target,
//         //     status: update.status || '',
//         //     name: ((update.target ? _targetStringFromTarget(update.target) : update.builder.name) + ' '.repeat(80)).substr(0, 40)
//         // };
//         // if (update.status !== undefined) {
//         //     data.status = update.status;
//         // }
//         // switch (update.state) {
//         //     case BuilderProgressState.Error:
//         //         data.status = 'Error: ' + update.error;
//         //         bars.update(update.id, data);
//         //         break;
//         //     case BuilderProgressState.Stopped:
//         //         data.status = 'Done.';
//         //         bars.complete(update.id);
//         //         bars.update(update.id, data, update.total, update.total);
//         //         break;
//         //     case BuilderProgressState.Waiting:
//         //         bars.update(update.id, data);
//         //         break;
//         //     case BuilderProgressState.Running:
//         //         bars.update(update.id, data, update.current, update.total);
//         //         break;
//         // }
//         // bars.render();
//     });

//     // Wait for full completion of the builder.
//     try {
//         const { success } = await run.output
//             .pipe
//             // tap(result => {
//             //     if (result.success) {
//             //         parentLogger.info(colors.green('SUCCESS'));
//             //     } else {
//             //         parentLogger.info(colors.red('FAILURE'));
//             //     }
//             //     parentLogger.info('Result: ' + JSON.stringify({ ...result, info: undefined }, null, 4));
//             //     parentLogger.info('\nLogs:');
//             //     logs.forEach(l => parentLogger.next(l));
//             //     logs.splice(0);
//             // })
//             ()
//             .toPromise();

//         await run.stop();
//         // bars.terminate();

//         return success ? 0 : 1;
//     } catch (err) {
//         parentLogger.info(colors.red('ERROR'));
//         parentLogger.info('\nLogs:');
//         logs.forEach(l => parentLogger.next(l));

//         parentLogger.fatal('Exception:');
//         parentLogger.fatal(err.stack);

//         return 2;
//     }
// }

// export async function executeTarget(target: 'build' | 'serve', args: string[]): Promise<number> {
//     /** Create the DevKit Logger used through the CLI. */
//     const logger = createConsoleLogger(false, process.stdout, process.stderr, {
//         info: s => s,
//         debug: s => s,
//         warn: s => colors.yellow(s),
//         error: s => colors.red(s),
//         fatal: s => colors.red(s)
//     });

//     // Load workspace configuration file.
//     const currentPath = process.cwd();
//     const configFilePath = path.resolve(currentPath, 'angular.json');

//     const root = path.dirname(configFilePath);

//     const registry = new schema.CoreSchemaRegistry();
//     registry.addPostTransform(schema.transforms.addUndefinedDefaults);

//     // Show usage of deprecated options
//     registry.useXDeprecatedProvider(msg => logger.warn(msg));

//     const { workspace } = await workspaces.readWorkspace(configFilePath, workspaces.createWorkspaceHost(new NodeJsSyncHost()));

//     // Clear the console.
//     process.stdout.write('\u001Bc');

//     return await _executeTarget(logger, workspace, root, , registry);
// }
