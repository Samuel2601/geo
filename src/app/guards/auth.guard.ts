import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MainService } from '../service/main.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard  {
	constructor(private _router: Router, private _mainService: MainService) {}

	canActivate(): any {
		let access: any = this._mainService.isAuthenticate();

		if (!access) {
			this._router.navigate(['home']);
		}
		return true;
	}
}
