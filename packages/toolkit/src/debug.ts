// we encountered a weird compilation error which says "debug" doesn't expose a default export but in fact it does
// i'm not sure if this is a bug in typescript but just use `require` to bypass the type checking
import $debug from 'debug';

export function debugFactory(rootNamespace: string) {
    const DELIMITER = ':';
    const DEBUGGERS = new Map<string, any>();

    return (message: string, ...namespaces: string[]): void => {
        const ns = [rootNamespace, ...namespaces].join(DELIMITER);
        let dbg = DEBUGGERS.get(ns);
        if (!dbg) {
            dbg = $debug(ns);
            DEBUGGERS.set(ns, dbg);
        }
        dbg(message);
    };
}

export const debug = debugFactory('docgeni');
