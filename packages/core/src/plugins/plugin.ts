import { IDocgeni } from '../docgeni.interface';

export interface Plugin {
    apply(docgeni: IDocgeni): void;
}
