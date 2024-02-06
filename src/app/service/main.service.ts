import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MainService {
	private mostrarMenuMobile: boolean = false;
	toggleMenuMobile() {
		this.mostrarMenuMobile = !this.mostrarMenuMobile;
	}

	isMobileMenuOpen() {
		return this.mostrarMenuMobile;
	}
  public url;

  constructor(private _http: HttpClient) { 
    this.url = GLOBAL.url;
    // Obtén el token CSRF del servidor y guárdalo en una variable
   

  }
  obtenerTokenDesdeServidor(){
    return '';
  }
  login(){
    const csrfToken = this.obtenerTokenDesdeServidor();

    // Configura los encabezados de la solicitud HTTP con el token CSRF
    const headers = new HttpHeaders({
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    });
  }

  isAuthenticate() {
		const token: any = localStorage.getItem('token');

		try {
			const helper = new JwtHelperService();
			var decodedToken = helper.decodeToken(token);

			if (!token) {
				localStorage.clear();
				return false;
			}

			if (!decodedToken) {
				localStorage.clear();
				return false;
			}

			if (helper.isTokenExpired(token)) {
				localStorage.clear();
				return false;
			}
		} catch (error) {
			//console.log(error);

			localStorage.clear();
			return false;
		}

		return true;
	}
}
