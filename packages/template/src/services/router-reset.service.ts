import { GlobalContext } from './global-context';
import { NavigationService } from './navigation.service';
import { Injectable, inject } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { NavigationItem } from '../interfaces';
import { DocViewerComponent, DocViewerHomeComponent } from '../pages/doc-viewer/doc-viewer.component';
import { ComponentOverviewComponent } from '../pages/component-viewer/overview/component-overview.component';
import { ComponentApiComponent, ComponentEmptyComponent, ComponentExamplesComponent } from '../pages/component-viewer';
import { HomeComponent } from '../pages/home/home.component';
import { ExampleIsolatedViewerComponent } from '../pages/example/example.component';
import { ActualRootComponent } from '../pages/root/root.component';

const componentChildrenRoutes: Routes = [
    {
        path: '',
        component: DocViewerHomeComponent,
    },
    {
        path: 'overview',
        component: ComponentOverviewComponent,
    },
    {
        path: 'api',
        component: ComponentApiComponent,
    },
    {
        path: 'examples',
        component: ComponentExamplesComponent,
    },
    {
        path: 'empty',
        component: ComponentEmptyComponent,
    },
    {
        path: '**',
        component: ComponentExamplesComponent,
    },
];

@Injectable({
    providedIn: 'root',
})
export class RouterResetService {
    private router = inject(Router);
    private global = inject(GlobalContext);
    private navigationService = inject(NavigationService);

    resetRoutes() {
        const config = this.router.config;
        const routes: Routes = [
            {
                path: '',
                component: HomeComponent,
            },
        ];
        const rootRoutes: Routes = [
            ...this.global.config.locales!.map((locale) => {
                return {
                    path: locale.key,
                    component: ActualRootComponent,
                    children: routes,
                };
            }),
            {
                path: '',
                component: ActualRootComponent,
                children: routes,
            },
            {
                path: '~examples/:name',
                component: ExampleIsolatedViewerComponent,
            },
        ];

        let shouldRemoveHome = false;
        if (this.global.config.mode === 'full') {
            this.navigationService
                .channels()
                .filter((channel) => !channel.isExternal && channel.path)
                .forEach((channel) => {
                    const firstDocItem = channel.items?.length
                        ? this.navigationService.searchFirstDocItem(channel.items as NavigationItem[])
                        : null;
                    const hasChannelIndexDoc = this.global.docItems.some(
                        (docItem) => docItem.channelPath === channel.path && docItem.path === channel.path,
                    );
                    if (firstDocItem?.path && !hasChannelIndexDoc && firstDocItem.path !== channel.path) {
                        routes.push({
                            path: channel.path!,
                            redirectTo: firstDocItem.path,
                            pathMatch: 'full',
                        });
                    }
                });
            this.global.docItems.forEach((docItem) => {
                const route: Route = docItem.importSpecifier
                    ? {
                          path: docItem.path,
                          component: DocViewerComponent,
                          children: componentChildrenRoutes,
                      }
                    : {
                          path: docItem.path,
                          component: DocViewerComponent,
                      };

                if (docItem.channelPath) {
                    routes.push(route);
                } else if (!docItem.importSpecifier) {
                    // 独立的页面，不属于任何频道
                    route.data = {
                        single: true,
                    };
                    routes.push(route);
                }
            });
        } else {
            this.global.docItems.forEach((docItem) => {
                const route = docItem.importSpecifier
                    ? {
                          path: docItem.path,
                          component: DocViewerComponent,
                          children: componentChildrenRoutes,
                      }
                    : {
                          path: docItem.path,
                          component: DocViewerComponent,
                      };
                // remove home when route path is ''
                if (route.path === '') {
                    shouldRemoveHome = true;
                }
                routes.push(route);
            });
            if (shouldRemoveHome) {
                routes.splice(0, 1);
            }
        }

        this.router.resetConfig([...config, ...rootRoutes, { path: '**', redirectTo: '' }]);
    }
}
