import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ChannelComponent } from './pages/channel/channel.component';
import { DocViewerComponent, DocViewerHomeComponent } from './pages/doc-viewer/doc-viewer.component';
import {
    ComponentOverviewComponent,
    ComponentApiComponent,
    ComponentExamplesComponent,
    ComponentEmptyComponent
} from './pages/pages.module';

const actualRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: ':channel',
        component: ChannelComponent,
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
                        component: ComponentOverviewComponent
                    },
                    {
                        path: 'api',
                        component: ComponentApiComponent
                    },
                    {
                        path: 'examples',
                        component: ComponentExamplesComponent
                    },
                    {
                        path: 'empty',
                        component: ComponentEmptyComponent
                    },
                    {
                        path: '**',
                        component: ComponentExamplesComponent
                    }
                ]
            }
        ]
    }
];

export const routes: Routes = [...actualRoutes];
