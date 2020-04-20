import { Routes } from '@angular/router';
import { DocHomeComponent } from './pages/home/home.component';
import { DocChannelComponent } from './pages/channel/channel.component';
import { DocViewerComponent, DocViewerHomeComponent } from './pages/doc-viewer/doc-viewer.component';
import {
    DocComponentOverviewComponent,
    DocComponentApiComponent,
    DocComponentExamplesComponent
} from './pages/pages.module';

export const routes: Routes = [
    {
        path: '',
        component: DocHomeComponent
    },
    {
        path: ':channel',
        component: DocChannelComponent,
        children: [
            {
                path: '',
                component: DocViewerComponent
            },
            {
                path: ':id',
                component: DocViewerComponent,
                children: [
                    {
                        path: '',
                        component: DocViewerHomeComponent
                    },
                    {
                        path: 'overview',
                        component: DocComponentOverviewComponent
                    },
                    {
                        path: 'api',
                        component: DocComponentApiComponent
                    },
                    {
                        path: 'examples',
                        component: DocComponentExamplesComponent
                    }
                ]
            }
        ]
    }
];
