export interface NgModuleInfo {
    /** Name of the NgModule. */
    name: string;
    /**
     * Import specifier that resolves to this module. The specifier is not scoped to
     * `@angular/components-examples` because it's up to the consumer how the module is
     * imported. For example, in the docs app, modules are lazily imported from `fesm2015/`.
     */
    importSpecifier: string;
}

export interface NgDefaultExportInfo {
    providers: string;
    imports: string;
    declarations: string;
}
