import { IsComponentDocPipe } from './pipes/nav.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ExampleViewerComponent } from './example-viewer/example-viewer.component';
import { IconComponent } from './icon/icon.component';
import { ContentViewerComponent } from './content-viewer/content-viewer.component';
import { DocHeaderComponent } from './doc-header/doc-header.component';
import { LabelComponent } from './label/label.component';
import { TableOfContentsComponent } from './toc/toc.component';
import { AssetsContentPathPipe } from './pipes/assets-content-path.pipe';
import { CopierService } from './copier/copier.service';
import { IsModeFullPipe, IsModeLitePipe } from './pipes/mode.pipe';
import { LocalesSelectorComponent } from './locales-selector/locales-selector.component';
import { LogoComponent } from './logo/logo.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { HeroActionClassPipe } from './pipes/hero.pipe';
import { DocMetaComponent } from './doc-meta/doc-meta.component';
import { CopyComponent } from './copy/copy.component';
import { SourceCodeComponent } from './source-code/source-code.component';
import { ExampleRendererComponent } from './example-renderer/example-renderer.component';
import { DocPagesLinksComponent } from './doc-pages-links/doc-pages-links.component';
import { SearchComponent } from './search/search.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { IsNgContentChildKindPipe } from './pipes/ng-kind.pipe';
import { PropertyNamePipe } from './pipes/property-name.pipe';
import { ThemesSelectorComponent } from './themes-selector/themes-selector.component';

const COMPONENTS = [
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    ExampleViewerComponent,
    ExampleRendererComponent,
    IconComponent,
    DocHeaderComponent,
    ContentViewerComponent,
    SourceCodeComponent,
    LabelComponent,
    LocalesSelectorComponent,
    ThemesSelectorComponent,
    AssetsContentPathPipe,
    LogoComponent,
    CopyComponent,
    IsComponentDocPipe,
    IsNgContentChildKindPipe,
    PropertyNamePipe,
    TranslatePipe,
    IsModeLitePipe,
    IsModeFullPipe,
    HeroActionClassPipe,
    DocMetaComponent,
    DocPagesLinksComponent,
    SearchComponent,
    HighlightPipe,
];
@NgModule({
    declarations: [...COMPONENTS],
    exports: [CommonModule, FormsModule, RouterModule, ...COMPONENTS, TableOfContentsComponent],
    imports: [CommonModule, FormsModule, RouterModule, TableOfContentsComponent],
    providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class DocgeniSharedModule {}

export {
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    ExampleViewerComponent,
    ExampleRendererComponent,
    IconComponent,
    DocHeaderComponent,
    LabelComponent,
    ContentViewerComponent,
    SourceCodeComponent,
    TableOfContentsComponent,
    CopierService,
    CopyComponent,
    AssetsContentPathPipe,
    IsModeFullPipe,
    IsModeLitePipe,
    HighlightPipe,
};
