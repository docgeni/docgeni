import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NavigationService } from './navigation.service';
import { ChannelItem } from '../interfaces/public-api';

@Injectable({ providedIn: 'root' })
export class ChannelResolver {
    constructor(private navigationService: NavigationService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ChannelItem> | Promise<ChannelItem> | ChannelItem {
        const path = route.paramMap.get('channel');
        const channel = this.navigationService.getChannel(path!);
        return channel;
    }
}
