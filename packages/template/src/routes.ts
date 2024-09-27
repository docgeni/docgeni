import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const actualRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
];

export const routes: Routes = [...actualRoutes];
