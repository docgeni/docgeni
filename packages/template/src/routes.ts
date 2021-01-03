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
    }
];

export const routes: Routes = [...actualRoutes];
