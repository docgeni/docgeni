import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ExampleViewerComponent } from './example-viewer/example-viewer.component';
import { IconComponent } from './icon/icon.component';

@NgModule({
    declarations: [NavbarComponent, FooterComponent, SidebarComponent, ExampleViewerComponent, IconComponent],
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
        ExampleViewerComponent,
        IconComponent
    ]
})
export class DocgeniSharedModule {}

export { NavbarComponent, FooterComponent, SidebarComponent, ExampleViewerComponent, IconComponent };
