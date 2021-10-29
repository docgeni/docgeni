import { Component, OnInit, HostBinding, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CategoryItem, NavigationItem } from '../../interfaces/public-api';
import { GlobalContext } from '../../services/global-context';

@Component({
    selector: 'dg-sidebar',
    templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnChanges {
    @HostBinding(`class.dg-sidebar`) isSidebar = true;

    @Input() menus: NavigationItem[];

    menuDisplayMap = new Map<CategoryItem, boolean>();

    readonly initDisplay = true;

    constructor(public global: GlobalContext, private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        this.router.events.pipe(filter(item => item instanceof NavigationEnd)).subscribe(() => {
            this.updateGroupsCollapseStates();
        });
    }

    toggle(menu: CategoryItem) {
        if (!menu.items || !menu.items.length) {
            return;
        }
        let status = this.menuDisplayMap.get(menu);
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
            let urlTree = this.router.createUrlTree(['./' + menu.path], { relativeTo: this.activatedRoute });
            let result = this.router.isActive(urlTree, !menu.examples);
            if (result) {
                ancestors = menu.ancestors;
                break;
            }
        }
        ancestors.forEach(menu => {
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
