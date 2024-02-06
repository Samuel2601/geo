import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { HomeComponent } from './component/home/home.component'; 
import { AuthGuard } from '../app/guards/auth.guard';
import { InicioPage } from './component/pages/inicio/inicio.page';
import { RegistroPage } from './component/pages/registro/registro.page';
const appRoute: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },

	{ path: 'home', component: HomeComponent },//, canActivate: [AuthGuard]
	{ path:'inicio', component:InicioPage },
	{ path:'registro', component:RegistroPage }
	/* {path: '**', component: NotFoundComponent}, */
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
