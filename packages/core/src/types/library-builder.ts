import { LibraryComponent } from './library-component';
import { CategoryItem, DocgeniLibrary } from '../interfaces';
import { EmitFiles } from './file';
import { NgDocParser } from '@docgeni/ngdoc';

/**
 * 包含内部属性的定义
 */
export interface Library extends DocgeniLibrary {
    categories?: CategoryItem[];
    ngDocParser?: NgDocParser;
}

export interface LibraryBuilder {
    readonly components: Map<string, LibraryComponent>;
    readonly lib: Library;
    build(components: LibraryComponent[]): Promise<void>;
    emit(): Promise<EmitFiles>;
}
