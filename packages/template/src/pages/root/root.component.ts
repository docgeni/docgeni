import { Route, Router, Routes } from '@angular/router';
import { NavigationService } from './../../services/navigation.service';
import { Component, HostBinding } from '@angular/core';
import { GlobalContext } from '../../services/public-api';
import { ChannelItem } from '../../interfaces';
import { DocViewerComponent, DocViewerHomeComponent } from '../doc-viewer/doc-viewer.component';
import {
    ComponentApiComponent,
    ComponentEmptyComponent,
    ComponentExamplesComponent,
    ComponentOverviewComponent
} from '../component-viewer';
import { ChannelComponent } from '../channel/channel.component';

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
@Component({
    selector: 'dg-root',
    templateUrl: './root.component.html'
})
export class RootComponent {
    @HostBinding(`class.dg-main`) isMain = true;

    @HostBinding(`class.dg-layout`) isLayout = true;

    channels: ChannelItem[];

    constructor(public global: GlobalContext, private navigationService: NavigationService, private router: Router) {
        this.channels = navigationService.getChannels();
        this.resetRoutes();
    }

    resetRoutes() {
        const config = this.router.config;
        let routes: Routes = [];
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

        this.router.resetConfig([...config, ...routes]);
    }
}
