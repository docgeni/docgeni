import { NgModuleInfo } from './module';

export interface LiveExample {
    /** Title of the example. */
    title: string;
    /** Name of the example component. */
    componentName: string;
    /** List of additional components which are part of the example. */
    additionalComponents?: string[];
    /** List of additional files which are part of the example. */
    additionalFiles?: string[];
    /** NgModule that declares this example. */
    module: NgModuleInfo;
}
