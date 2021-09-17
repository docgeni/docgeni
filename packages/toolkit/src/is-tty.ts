function isTruthy(value: undefined | string): boolean {
    // Returns true if value is a string that is anything but 0 or false.
    return value !== undefined && value !== '0' && value.toUpperCase() !== 'FALSE';
}

export function isTTY(): boolean {
    // If we force TTY, we always return true.
    // eslint-disable-next-line dot-notation
    const force = process.env['FORCE_TTY'];
    if (force !== undefined) {
        return isTruthy(force);
    }

    // eslint-disable-next-line dot-notation
    return !!process.stdout.isTTY && !isTruthy(process.env['CI']);
}
