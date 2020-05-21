import { Component, OnInit, HostBinding, Input, Type, NgModuleFactory, ɵNgModuleFactory, ViewChild } from '@angular/core';
// import { trigger, transition, state, style, animate } from '@angular/animations';

import { LiveExample } from '../../interfaces';
import { ExampleLoader } from '../../services/example-loader';
import { ContentViewerComponent } from '../content-viewer/content-viewer.component';
import { CopierService } from '../copier/copier.service';

const EXAMPLES_SOURCE_PATH = `/assets/content/examples-source`;

interface ExampleTab {
    name: string;
    path: string;
}

@Component({
    selector: 'dg-example-viewer',
    templateUrl: './example-viewer.component.html'
})
export class ExampleViewerComponent implements OnInit {
    @HostBinding('class.dg-example-viewer') isExampleViewer = true;

    @Input() exampleName: string;

    @HostBinding('class.dg-example-viewer-inline')
    @Input() inline: boolean;

    @ViewChild('contentViewer') contentViewer: ContentViewerComponent;

    /** Component type for the current example. */
    exampleComponentType: Type<any> | null = null;

    exampleModuleFactory: NgModuleFactory<any> | null = null;

    example: LiveExample;

    showSource = false;

    copyIcon = 'copy';

    exampleTabs: ExampleTab[] = [];

    selectedTab: ExampleTab;

    constructor(private exampleLoader: ExampleLoader, private copier: CopierService) {}

    ngOnInit(): void {
        this.exampleLoader.load(this.exampleName).then(result => {
            this.exampleModuleFactory = new ɵNgModuleFactory(result.moduleType);
            this.exampleComponentType = result.componentType;
            this.example = result.example;
            const rootPath = `${EXAMPLES_SOURCE_PATH}/${this.example.module.importSpecifier}/${this.example.name}`;
            this.exampleTabs = [
                {
                    name: `TS`,
                    path: `${rootPath}/${this.example.name}.component.ts`
                },
                {
                    name: `HTML`,
                    path: `${rootPath}/${this.example.name}.component.html`
                },
                {
                    name: `CSS`,
                    path: `${rootPath}/${this.example.name}.component.scss`
                }
            ];
            this.selectedTab = this.exampleTabs[0];
        });
    }

    selectExampleTab(tab: ExampleTab) {
        this.selectedTab = tab;
    }

    copy() {
        const text = this.contentViewer['elementRef'].nativeElement.innerHTML;
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
