import { Component, OnInit, HostBinding, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CategoryItem, NavigationItem } from '../../interfaces/public-api';
import { GlobalContext } from '../../services/global-context';
import { LogoComponent } from '../logo/logo.component';
import { SearchComponent } from '../search/search.component';
import { NgTemplateOutlet } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { LabelComponent } from '../label/label.component';
import { TableOfContentsComponent } from '../toc/toc.component';
import { LocalesSelectorComponent } from '../locales-selector/locales-selector.component';
import { IsModeLitePipe } from '../pipes/mode.pipe';

@Component({
    selector: 'dg-sidebar',
    templateUrl: './sidebar.component.html',
    imports: [
        LogoComponent,
        RouterLink,
        SearchComponent,
        NgTemplateOutlet,
        IconComponent,
        RouterLinkActive,
        LabelComponent,
        TableOfContentsComponent,
        LocalesSelectorComponent,
        IsModeLitePipe,
    ],
})
export class SidebarComponent implements OnInit, OnChanges {
    @HostBinding(`class.dg-sidebar`) isSidebar = true;

    @Input() menus!: NavigationItem[];

    menuDisplayMap = new Map<CategoryItem, boolean>();

    readonly initDisplay = true;

    constructor(
        public global: GlobalContext,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.router.events.pipe(filter((item) => item instanceof NavigationEnd)).subscribe(() => {
            this.updateGroupsCollapseStates();
        });
    }

    toggle(menu: CategoryItem) {
        if (!menu.items || !menu.items.length) {
            return;
        }
        const status = this.menuDisplayMap.get(menu);
        this.setMenuOpen(menu, !status);
    }

    private setMenuOpen(menu: CategoryItem, open: boolean) {
        this.menuDisplayMap.set(menu, open);
    }

    ngOnChanges(): void {
        if (this.initDisplay) {
            this.setMenuDisplay(this.menus);
        }
        this.updateGroupsCollapseStates();
    }

    private updateGroupsCollapseStates() {
        let ancestors: CategoryItem[] = [];
        for (const menu of this.global.docItems) {
            const urlTree = this.router.createUrlTree(['./' + menu.path], { relativeTo: this.activatedRoute });
            const result = this.router.isActive(urlTree, !menu.examples);
            if (result) {
                ancestors = menu.ancestors || [];
                break;
            }
        }
        ancestors.forEach((menu) => {
            this.setMenuOpen(menu, true);
        });
    }

    private setMenuDisplay(menus: CategoryItem[]) {
        for (const menu of menus) {
            this.menuDisplayMap.set(menu, true);
            if (menu.items && menu.items.length) {
                this.setMenuDisplay(menu.items);
            }
        }
    }
}
