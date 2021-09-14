import * as shell from './shell';

export function lastUpdatedTime(filePath: string): number {
    return parseInt(shell.execSync(`git log --pretty=format:"%at" -n 1 ${filePath}`, { stdio: 'pipe' }).toString(), 10);
}

export function contributors(filePath: string | string[]) {
    return Array.from(
        new Set(
            shell
                .execSync(`git log --pretty=format:"%an" ${typeof filePath === 'string' ? filePath : filePath.join(' ')}`, {
                    stdio: 'pipe'
                })
                .toString()
                .split('\n')
        )
    );
}
