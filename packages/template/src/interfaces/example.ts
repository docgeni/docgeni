import { NgModuleInfo } from './module';

export interface ExampleSourceFile {
    name: string;
    highlightedPath: string;
    highlightedContent?: string;
    content?: string;
}

export interface LiveExample {
    /** Key of the example. alib-button-basic-example */
    key: string;
    /** Name of the example. basic or advance */
    name: string;
    /** Title of the example. */
    title: string;
    /** Background color of the example. */
    background?: string;
    /** Remove padding for the example when compact is true. */
    compact?: boolean;
    /** Class name for styles of the example. */
    className?: string;
    /** Name of the example component. */
    componentName: string;
    /** List of source files which are all of the example. */
    sourceFiles: ExampleSourceFile[];
    /** List of additional components which are part of the example. */
    additionalComponents?: string[];
    /** List of additional files which are part of the example. */
    additionalFiles?: string[];
    /** NgModule that declares this example. */
    module: NgModuleInfo;
}
