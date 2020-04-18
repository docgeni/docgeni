import { DocgeniContext } from '../docgeni.interface';

export interface Plugin {
    apply(docgeni: DocgeniContext): void;
}
