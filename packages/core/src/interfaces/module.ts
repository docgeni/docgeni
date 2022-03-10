export interface NgModuleInfo {
    /** Name of the NgModule. */
    name: string;
    /**
     * Import specifier that resolves to this module. e.g. alib/button
     */
    importSpecifier: string;
}

export interface NgDefaultExportInfo {
    providers: string;
    imports: string;
    declarations: string;
}
