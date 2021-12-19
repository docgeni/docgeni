import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) {}

    highlightTitle(keywords: string, title: string) {
        const reg = new RegExp(`(${keywords})`, 'gi');
        const chunks = title.split(reg);

        let formatTitle = '';
        chunks.forEach(chunk => {
            if (chunk) {
                formatTitle =
                    formatTitle + (chunk.toLocaleLowerCase() === keywords ? `<span class="dg-word-highlight">${chunk}</span>` : chunk);
            }
        });
        return formatTitle;
    }

    transform(keywords: string, title: string) {
        keywords = (keywords || '').trim().toLocaleLowerCase();
        if (keywords && title) {
            const template = this.highlightTitle(keywords, title);
            return this.domSanitizer.bypassSecurityTrustHtml(template);
        } else {
            return title;
        }
    }
}
