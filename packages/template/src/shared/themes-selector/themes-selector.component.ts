import { Location } from '@angular/common';
import { Component, OnInit, HostBinding } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';
import { DocgeniTheme } from '../../interfaces';

@Component({
    selector: 'dg-themes-selector',
    templateUrl: './themes-selector.component.html',
})
export class ThemesSelectorComponent implements OnInit {
    @HostBinding('class.dg-themes-selector') isNavbar = true;

    cacheKey = 'docgeni-theme';

    isTooltipOpen = false;

    theme!: DocgeniTheme;

    themesMap: Record<DocgeniTheme, { key: DocgeniTheme; icon: string; actionTooltip: string }> = {
        [DocgeniTheme.light]: { key: DocgeniTheme.light, icon: 'lightTheme', actionTooltip: '切换暗黑主题' },
        [DocgeniTheme.dark]: { key: DocgeniTheme.dark, icon: 'darkTheme', actionTooltip: '切换亮色主题' },
    };

    constructor(
        public global: GlobalContext,
        public navigationService: NavigationService,
        private location: Location,
    ) {}

    ngOnInit(): void {
        this.theme = this.global.theme;
    }

    toggleTheme() {
        this.theme = this.theme === DocgeniTheme.dark ? DocgeniTheme.light : DocgeniTheme.dark;
        this.global.setTheme(this.theme);
    }
}
