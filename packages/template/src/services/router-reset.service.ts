import { GlobalContext } from './global-context';
import { Injectable } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { ChannelComponent } from '../pages/channel/channel.component';
import { DocViewerComponent, DocViewerHomeComponent } from '../pages/doc-viewer/doc-viewer.component';
import { ComponentOverviewComponent } from '../pages/component-viewer/overview/component-overview.component';
import { ComponentApiComponent, ComponentEmptyComponent, ComponentExamplesComponent } from '../pages/component-viewer';
import { HomeComponent } from '../pages/home/home.component';

const componentChildrenRoutes: Routes = [
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
];

@Injectable({
    providedIn: 'root'
})
export class RouterResetService {
    constructor(private router: Router, private global: GlobalContext) {}

    resetRoutes() {
        const config = this.router.config;
        const routes: Routes = [
            {
                path: '',
                component: HomeComponent
            }
        ];
        const channelPathToRoutes: Record<string, Route> = {};
        if (this.global.config.mode === 'full') {
            const rootNavs = this.global.navs.filter(nav => {
                return !nav.isExternal;
            });
            rootNavs.forEach(nav => {
                if (nav.items) {
                    const route = {
                        path: nav.path,
                        component: ChannelComponent,
                        children: []
                    };
                    if (nav.lib) {
                        route.children = [
                            {
                                path: ':id',
                                component: DocViewerComponent,
                                children: componentChildrenRoutes
                            }
                        ];
                    }
                    routes.push(route);
                    channelPathToRoutes[nav.path] = route;
                } else {
                    routes.push({
                        path: nav.path,
                        component: DocViewerComponent
                    });
                }
            });
            this.global.docItems.forEach(docItem => {
                const route = docItem.importSpecifier
                    ? {
                          path: docItem.path,
                          component: DocViewerComponent,
                          children: componentChildrenRoutes
                      }
                    : {
                          path: docItem.path,
                          component: DocViewerComponent
                      };

                const channelRoute = channelPathToRoutes[docItem.channel_path];
                if (channelRoute) {
                    channelRoute.children.push(route);
                } else if (!docItem.importSpecifier) {
                    routes.push(route);
                }
            });
        } else {
            this.global.docItems.forEach(docItem => {
                const route = docItem.importSpecifier
                    ? {
                          path: docItem.path,
                          component: DocViewerComponent,
                          children: componentChildrenRoutes
                      }
                    : {
                          path: docItem.path,
                          component: DocViewerComponent
                      };
                routes.push(route);
            });
        }

        this.router.resetConfig([...config, ...routes, { path: '**', redirectTo: '' }]);
    }
}
