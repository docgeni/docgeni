import { LibraryComponent } from './library-component';
import { Library } from '../interfaces';
import { EmitFiles } from './file';

export interface LibraryBuilder {
    readonly components: Map<string, LibraryComponent>;
    readonly lib: Library;
    build(components: LibraryComponent[]): Promise<void>;
    emit(): Promise<EmitFiles>;
}
