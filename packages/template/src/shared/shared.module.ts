import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DocExampleViewerComponent } from './example-viewer/example-viewer.component';

@NgModule({
    declarations: [NavbarComponent, FooterComponent, SidebarComponent, DocExampleViewerComponent],
    imports: [CommonModule, BrowserModule, FormsModule, RouterModule, HttpClientModule],
    exports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        RouterModule,
        HttpClientModule,
        NavbarComponent,
        SidebarComponent,
        FooterComponent,
        DocExampleViewerComponent
    ]
})
export class DocgeniTemplateSharedModule {}

export { NavbarComponent, FooterComponent, SidebarComponent, DocExampleViewerComponent };
