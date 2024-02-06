import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';

import { routing } from './app.routing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { SidebarComponent } from './component/menu/sidebar/sidebar.component';
import { FooterComponent } from './component/menu/footer/footer.component';
import { NavbarComponent } from './component/menu/navbar/navbar.component';
import { MapComponent } from './component/map/map.component';

import { AboutPage } from './component/pages/about/about.page';
import { DetalleSolicitudPage } from './component/pages/detalle-solicitud/detalle-solicitud.page';
import { InicioPage } from './component/pages/inicio/inicio.page';
import { SolicitudPage } from './component/pages/solicitud/solicitud.page';
import { SubcatPage } from './component/pages/subcat/subcat.page';
import { RegistroPage } from './component/pages/registro/registro.page';
import { UpdatePasswordPage } from './component/pages/update-password/update-password.page';
import { ShowHidePasswordComponent } from './component/pages/show-hide-password/show-hide-password.component';
import { CommonModule } from '@angular/common';
import { enterPageAnimation } from './component/animations/animations';
import { IonicStorageModule } from '@ionic/storage-angular';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    MapComponent,
    AboutPage,
    InicioPage,
    SolicitudPage,
    SubcatPage,
    RegistroPage,
    UpdatePasswordPage,
    DetalleSolicitudPage,
    ShowHidePasswordComponent,
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    LeafletModule,
    HttpClientModule,
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    RouterModule.forRoot([]),
    routing
  ],
  providers: [Location,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, ScreenOrientation],
  bootstrap: [AppComponent]
})
export class AppModule { }
