export * from 'shelljs';
import { execSync as _execSync, spawnSync as _spawnSync, ExecSyncOptions, SpawnSyncOptions } from 'child_process';

export function execSync(command: string, options: ExecSyncOptions = { stdio: 'inherit' }) {
    return _execSync(command, options);
}
export function spawnSync(command: string, args: string[], options: SpawnSyncOptions = { stdio: 'inherit' }) {
    return _spawnSync(command, args, options);
}
