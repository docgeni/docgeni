import { ComponentDocItem, Library, LiveExample } from '../interfaces';
import { EmitFiles } from './file';

export interface LibraryComponent {
    readonly absPath: string;
    readonly absDocPath: string;
    readonly absApiPath: string;
    readonly absExamplesPath: string;
    readonly name: string;
    readonly examples: LiveExample[];
    readonly lib: Library;
    build(): Promise<void>;
    emit(): Promise<EmitFiles>;
    getDocItem(locale: string): ComponentDocItem;
    getModuleKey(): string;
}
