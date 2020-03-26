import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocHomeComponent, DocChannelComponent, DocViewerComponent } from '@docg/template';

const routes: Routes = [
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
                path: ':doc',
                component: DocViewerComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
