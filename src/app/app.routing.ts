import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { HomeComponent } from './component/home/home.component'; 
import { AuthGuard } from '../app/guards/auth.guard';

const appRoute: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },

	{ path: 'home', component: HomeComponent },//, canActivate: [AuthGuard]

	/* {path: '**', component: NotFoundComponent}, */
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoute);
