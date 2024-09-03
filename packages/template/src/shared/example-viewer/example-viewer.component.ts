import { Component, OnInit, HostBinding, Input, Type } from '@angular/core';
import { LiveExample } from '../../interfaces/public-api';
import { ExampleLoader } from '../../services/example-loader';
import { GlobalContext } from '../../services/public-api';
import { HttpClient } from '@angular/common/http';
import { StackblitzExampleService } from '../../services/stackblitz-example.service';
import { forkJoin } from 'rxjs';
import { coerceBooleanProperty } from '../../utils';

const EXAMPLES_HIGHLIGHTED_PATH = `examples-highlighted`;

interface ExampleTab {
    name: string;
    path: string;
}

const nameOrdersMap: Record<string, number> = {
    HTML: 1,
    TS: 2,
    SCSS: 3,
    CSS: 4,
};

@Component({
    selector: 'dg-example-viewer',
    templateUrl: './example-viewer.component.html',
    host: {
        '[attr.id]': 'example?.key',
    },
})
export class ExampleViewerComponent implements OnInit {
    private _inline = false;

    @HostBinding('class.dg-example-viewer') isExampleViewer = true;

    /**
     * @deprecated please use name
     */
    @Input() set exampleName(name: string) {
        this.name = name;
    }

    @Input() name!: string;

    @HostBinding('class.dg-example-viewer-inline')
    @Input()
    get inline(): boolean {
        return this._inline;
    }

    set inline(value: boolean) {
        this._inline = coerceBooleanProperty(value);
    }

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleType: Type<any> | null = null;

    example!: LiveExample;

    showSource = false;

    exampleTabs: ExampleTab[] = [];

    selectedTab!: ExampleTab;

    get enableIvy() {
        return this.exampleLoader.enableIvy;
    }

    constructor(
        private exampleLoader: ExampleLoader,
        private globalContext: GlobalContext,
        private http: HttpClient,
        private stackblitzExampleService: StackblitzExampleService,
    ) {}

    // Use short name such as TS, HTML, CSS replace exampleName.component.*, we need to transform
    // the file name to match the exampleName.component.* that displays main source files.
    private transformFileName(fileName: string, exampleName: string) {
        return fileName.startsWith(`${exampleName}.component.`)
            ? fileName.replace(`${exampleName}.component.`, '').toUpperCase()
            : fileName;
    }

    ngOnInit(): void {
        this.exampleLoader.load(this.name).then((result) => {
            this.exampleModuleType = result.moduleType;
            this.exampleComponentType = result.componentType;
            this.example = result.example;
            const rootDir = this.globalContext.getAssetsContentPath(
                `${EXAMPLES_HIGHLIGHTED_PATH}/${this.example.module.importSpecifier}/${this.example.name}`,
            );

            this.exampleTabs = this.example.sourceFiles
                .map((file) => {
                    return {
                        name: this.transformFileName(file.name, this.example.name),
                        path: `${rootDir}/${file.highlightedPath}`,
                    };
                })
                // The order we expect is TS > HTML > SCSS | CSS
                .sort((a, b) => {
                    const aOrder = nameOrdersMap[a.name] || Number.MAX_SAFE_INTEGER;
                    const bOrder = nameOrdersMap[b.name] || Number.MAX_SAFE_INTEGER;
                    return aOrder > bOrder ? 1 : aOrder === bOrder ? 0 : -1;
                });
            this.selectedTab = this.exampleTabs[0];
        });
    }

    selectExampleTab(tab: ExampleTab) {
        this.selectedTab = tab;
    }

    toggleSource() {
        this.showSource = !this.showSource;
    }

    openStackBlitz() {
        forkJoin({
            examplesSources: this.http.get<{ path: string; content: string }[]>(
                `assets/content/examples-source-bundle/${this.example.module.importSpecifier}/bundle.json`,
            ),
            sharedFiles: this.http.get<{ path: string; content: string }[]>(`assets/stack-blitz/bundle.json`),
        }).subscribe(
            (result: { examplesSources: { path: string; content: string }[]; sharedFiles: { path: string; content: string }[] }) => {
                const { examplesSources, sharedFiles } = result;
                this.stackblitzExampleService.open(
                    [
                        ...examplesSources.map((item) => {
                            return {
                                ...item,
                                path: `src/${item.path}`,
                            };
                        }),
                        ...sharedFiles,
                    ],
                    this.example.module,
                    {
                        name: this.example.componentName,
                        selector: this.example.key,
                    },
                );
            },
        );
    }
}
