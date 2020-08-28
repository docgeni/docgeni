import { NavigationService } from './../../services/navigation.service';
import { Component, HostBinding } from '@angular/core';
import { GlobalContext } from '../../services/public-api';
import { ChannelItem } from '../../interfaces';

@Component({
    selector: 'dg-root',
    templateUrl: './root.component.html'
})
export class RootComponent {
    @HostBinding(`class.dg-main`) isMain = true;

    @HostBinding(`class.dg-layout`) isLayout = true;

    channels: ChannelItem[];

    constructor(public global: GlobalContext, private navigationService: NavigationService) {
        this.channels = navigationService.getChannels();
    }
}
