import { GlobalContext } from './global-context';
import { Injectable } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { ChannelComponent, ChannelHomeComponent } from '../pages/channel/channel.component';
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
        const routes: Routes = [];
        routes.push({
            path: '',
            component: HomeComponent
        });
        const channelPathToRoutes: Record<string, Route> = {};
        const channelPathToHomeRoutes: Record<string, Route> = {};
        let shouldRemoveHome = false;
        if (this.global.config.mode === 'full') {
            const rootNavs = this.global.navs.filter(nav => {
                return !nav.isExternal;
            });
            rootNavs.forEach(nav => {
                if (nav.items) {
                    const route: Route = {
                        path: nav.path,
                        component: ChannelComponent,
                        children: [
                            {
                                path: '',
                                component: ChannelHomeComponent
                            }
                        ]
                    };
                    channelPathToHomeRoutes[nav.path] = route.children[0];
                    if (nav.lib) {
                        route.children.push({
                            path: ':id',
                            component: DocViewerComponent,
                            children: componentChildrenRoutes
                        });
                    }
                    routes.push(route);
                    channelPathToRoutes[nav.path] = route;
                }
            });
            this.global.docItems.forEach(docItem => {
                const route: Route = docItem.importSpecifier
                    ? {
                          path: docItem.path,
                          component: DocViewerComponent,
                          children: componentChildrenRoutes
                      }
                    : {
                          path: docItem.path,
                          component: DocViewerComponent
                      };

                const channelRoute = channelPathToRoutes[docItem.channelPath];
                if (channelRoute) {
                    // remove chanel home when has route path is ''
                    if (route.path === '' && channelRoute.children.includes(channelPathToHomeRoutes[channelRoute.path])) {
                        channelRoute.children.splice(0, 1);
                    }
                    channelRoute.children.push(route);
                } else if (!docItem.importSpecifier) {
                    // 独立的页面，不属于任何频道
                    route.data = {
                        single: true
                    };
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

        this.router.resetConfig([...config, ...routes, { path: '**', redirectTo: '' }]);
    }
}
