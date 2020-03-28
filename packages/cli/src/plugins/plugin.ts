import { BuilderFacade } from '../builder.facade';

export interface Plugin {
    apply(builder: BuilderFacade): void;
}
