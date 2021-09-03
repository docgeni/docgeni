import { IsComponentDocPipe } from './pipes/nav.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { DateAutoFormatPipe, IsModeFullPipe, IsModeLitePipe } from './pipes/mode.pipe';
import { LocalesSelectorComponent } from './locales-selector/locales-selector.component';
import { LayoutModule } from '@angular/cdk/layout';
import { LogoComponent } from './logo/logo.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { HeroActionClassPipe } from './pipes/hero.pipe';
import { DocContributionComponent } from './doc-contribution/doc-contribution.component';

@NgModule({
    declarations: [
        NavbarComponent,
        FooterComponent,
        SidebarComponent,
        ExampleViewerComponent,
        IconComponent,
        DocHeaderComponent,
        ContentViewerComponent,
        LabelComponent,
        TableOfContentsComponent,
        LocalesSelectorComponent,
        AssetsContentPathPipe,
        LogoComponent,
        IsComponentDocPipe,
        TranslatePipe,
        IsModeLitePipe,
        IsModeFullPipe,
        HeroActionClassPipe,
        DocContributionComponent,
        DateAutoFormatPipe
    ],
    imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, LayoutModule],
    entryComponents: [ExampleViewerComponent],
    exports: [
        CommonModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        NavbarComponent,
        SidebarComponent,
        FooterComponent,
        ExampleViewerComponent,
        DocHeaderComponent,
        ContentViewerComponent,
        IconComponent,
        LabelComponent,
        TableOfContentsComponent,
        LogoComponent,
        AssetsContentPathPipe,
        IsComponentDocPipe,
        TranslatePipe,
        IsModeLitePipe,
        IsModeFullPipe,
        HeroActionClassPipe,
        DocContributionComponent,
        DateAutoFormatPipe
    ]
})
export class DocgeniSharedModule {}

export {
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    ExampleViewerComponent,
    IconComponent,
    DocHeaderComponent,
    LabelComponent,
    ContentViewerComponent,
    TableOfContentsComponent,
    CopierService,
    AssetsContentPathPipe,
    IsModeFullPipe,
    IsModeLitePipe
};
