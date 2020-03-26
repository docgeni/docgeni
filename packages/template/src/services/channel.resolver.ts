import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from './navigation.service';
import { Channel } from './interfaces';

@Injectable({ providedIn: 'root' })
export class ChannelResolver implements Resolve<Channel> {
    constructor(private navigationService: NavigationService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Channel> | Promise<Channel> | Channel {
        const path = route.paramMap.get('channel');
        const channel = this.navigationService.getPrimaryNav(path);
        return channel;
    }
}
