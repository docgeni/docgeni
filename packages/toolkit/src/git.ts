import * as shell from './shell';

export function lastUpdatedTime(filePath: string): number {
    const result = shell.spawnSync(`git`, ['log', '--pretty=format:"%at"', '-n', '1', filePath], { stdio: 'pipe' }).stdout;
    return result.length ? parseInt(JSON.parse(result.toString()), 10) : undefined;
}

export function contributors(filePath: string | string[]): string[] {
    filePath = typeof filePath === 'string' ? [filePath] : filePath;
    const result = shell.spawnSync('git', ['log', `--pretty=format:"%an"`, ...filePath], { stdio: 'pipe' }).stdout;
    return result.length
        ? Array.from(
              new Set(
                  result
                      .toString()
                      .split('\n')
                      .filter((item) => item)
                      .map((item) => JSON.parse(item)),
              ),
          )
        : [];
}
