import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';

import { routing } from './app.routing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { SidebarComponent } from './component/menu/sidebar/sidebar.component';
import { FooterComponent } from './component/menu/footer/footer.component';
import { NavbarComponent } from './component/menu/navbar/navbar.component';
import { MapComponent } from './component/map/map.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
