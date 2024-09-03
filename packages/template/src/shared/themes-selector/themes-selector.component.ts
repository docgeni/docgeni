import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { NavigationService, GlobalContext } from '../../services/public-api';
import { DocgeniTheme } from '../../interfaces';

@Component({
    selector: 'dg-themes-selector',
    templateUrl: './themes-selector.component.html',
})
export class ThemesSelectorComponent implements OnInit {
    @HostBinding('class.dg-themes-selector') isNavbar = true;

    cacheKey = 'docgeni-theme';

    isDropdownOpen = false;

    docgeniTheme = DocgeniTheme;

    theme!: DocgeniTheme;

    themesMap = {
        [DocgeniTheme.light]: { key: DocgeniTheme.light, name: '亮色主题', icon: 'lightTheme' },
        [DocgeniTheme.dark]: { key: DocgeniTheme.dark, name: '暗黑主题', icon: 'darkTheme' },
        [DocgeniTheme.system]: { key: DocgeniTheme.system, name: '跟随系统', icon: 'systemTheme' },
    };

    themes = [this.themesMap[DocgeniTheme.light], this.themesMap[DocgeniTheme.dark], this.themesMap[DocgeniTheme.system]];

    constructor(
        public global: GlobalContext,
        public navigationService: NavigationService,
    ) {}

    @HostListener('mouseenter')
    openDropdown() {
        this.isDropdownOpen = true;
    }

    @HostListener('mouseleave')
    closeDropdown() {
        this.isDropdownOpen = false;
    }

    ngOnInit(): void {
        this.theme = this.global.theme;
    }

    selectTheme(theme: DocgeniTheme) {
        this.theme = theme;
        this.global.setTheme(this.theme);
    }

    toggleTheme() {
        if (this.theme === DocgeniTheme.dark) {
            this.selectTheme(DocgeniTheme.light);
        } else if (this.theme === DocgeniTheme.light) {
            this.selectTheme(DocgeniTheme.dark);
        } else {
        }
    }
}
