export * from 'shelljs';
import { execSync as _execSync, ExecSyncOptions } from 'child_process';

export function execSync(command: string, options: ExecSyncOptions = { stdio: 'inherit' }) {
    return _execSync(command, options);
}
