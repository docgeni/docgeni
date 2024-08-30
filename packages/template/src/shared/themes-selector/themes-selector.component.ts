import { Location } from '@angular/common';
import { Component, OnInit, HostBinding } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';

const enum Theme {
    light = 'light',
    dark = 'dark'
}

@Component({
    selector: 'dg-themes-selector',
    templateUrl: './themes-selector.component.html'
})
export class ThemesSelectorComponent implements OnInit {
    @HostBinding('class.dg-themes-selector') isNavbar = true;

    cacheKey = 'docgeni-theme';

    isTooltipOpen = false;

    theme!: Theme;

    themesMap: Record<Theme, { key: Theme; icon: string; actionTooltip: string }> = {
        [Theme.light]: { key: Theme.light, icon: 'lightTheme', actionTooltip: '切换暗黑主题' },
        [Theme.dark]: { key: Theme.dark, icon: 'darkTheme', actionTooltip: '切换亮色主题' }
    };

    constructor(public global: GlobalContext, public navigationService: NavigationService, private location: Location) {}

    ngOnInit(): void {
        this.theme = window.localStorage.getItem(this.cacheKey) as Theme;
        this.setTheme();
    }

    toggleTheme() {
        this.theme = this.theme === Theme.dark ? Theme.light : Theme.dark;
        this.setTheme();
    }

    setTheme() {
        if (this.theme === Theme.dark) {
            document.documentElement.setAttribute('theme', Theme.dark);
            window.localStorage.setItem(this.cacheKey, Theme.dark);
        } else {
            document.documentElement.removeAttribute('theme');
            window.localStorage.setItem(this.cacheKey, Theme.light);
        }
    }
}
