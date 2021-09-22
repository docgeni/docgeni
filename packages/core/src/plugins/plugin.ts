import { DocgeniContext } from '../docgeni.interface';

// export interface Plugin {
//     apply(docgeni: DocgeniContext): void;
// }

export abstract class Plugin {
    abstract apply(docgeni: DocgeniContext): void;
}
