import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalContext } from './global-context';

@Injectable({ providedIn: 'root' })
export class PageTitleService {
    private bodyTitle = inject(Title);
    private globalContext = inject(GlobalContext);

    private innerTitle = '';

    get title(): string {
        return this.innerTitle;
    }

    set title(title: string) {
        this.innerTitle = title;
        if (title !== '') {
            title = `${title} - ${this.globalContext.config.title}`;
        } else {
            title = this.globalContext.config.title;
        }
        this.bodyTitle.setTitle(title);
    }
}
