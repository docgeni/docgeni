import { Component, OnInit, HostBinding, Input, Type, NgModuleFactory, ɵNgModuleFactory, ViewChild } from '@angular/core';
// import { trigger, transition, state, style, animate } from '@angular/animations';

import { LiveExample } from '../../interfaces';
import { ExampleLoader } from '../../services/example-loader';
import { ContentViewerComponent } from '../content-viewer/content-viewer.component';
import { CopierService } from '../copier/copier.service';
import { GlobalContext } from '../../services';

const EXAMPLES_HIGHLIGHTED_PATH = `examples-highlighted`;

interface ExampleTab {
    name: string;
    path: string;
}

const nameOrdersMap = {
    TS: 1,
    HTML: 2,
    SCSS: 3,
    CSS: 4
};

@Component({
    selector: 'dg-example-viewer',
    templateUrl: './example-viewer.component.html'
})
export class ExampleViewerComponent implements OnInit {
    @HostBinding('class.dg-example-viewer') isExampleViewer = true;

    @Input() exampleName: string;

    @HostBinding('class.dg-example-viewer-inline')
    @Input()
    inline: boolean;

    @ViewChild('contentViewer') contentViewer: ContentViewerComponent;

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    example: LiveExample;

    showSource = false;

    copyIcon = 'copy';

    exampleTabs: ExampleTab[] = [];

    selectedTab: ExampleTab;

    get enableIvy() {
        return this.exampleLoader.enableIvy;
    }

    constructor(private exampleLoader: ExampleLoader, private copier: CopierService, private globalContext: GlobalContext) {}

    // Use short name such as TS, HTML, CSS replace exampleName.component.*, we need to transform
    // the file name to match the exampleName.component.* that displays main source files.
    private transformFileName(fileName: string, exampleName: string) {
        return fileName.startsWith(`${exampleName}.component.`)
            ? fileName.replace(`${exampleName}.component.`, '').toUpperCase()
            : fileName;
    }

    ngOnInit(): void {
        this.exampleLoader.load(this.exampleName).then(result => {
            this.exampleModuleFactory = new ɵNgModuleFactory(result.moduleType);
            this.exampleComponentType = result.componentType;
            this.example = result.example;
            const rootDir = this.globalContext.getAssetsContentPath(
                `${EXAMPLES_HIGHLIGHTED_PATH}/${this.example.module.importSpecifier}/${this.example.name}`
            );

            this.exampleTabs = this.example.sourceFiles
                .map(file => {
                    return {
                        name: this.transformFileName(file.name, this.example.name),
                        path: `${rootDir}/${file.highlightedPath}`
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

    copy() {
        const text = this.contentViewer.elementRef.nativeElement.textContent;
        this.copier.copyText(text);
        this.copyIcon = 'check';

        setTimeout(() => {
            this.copyIcon = 'copy';
        }, 2000);
    }

    toggleSource() {
        this.showSource = !this.showSource;
    }
}
