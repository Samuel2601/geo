import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { SecurityService } from './security.service';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //private static readonly BASE_URL = 'http://192.168.120.16:3060/mobileapp-api/v1';
  private static readonly BASE_URL = 'http://localhost:3060/mobileapp-api/v1';
  readonly helper = new JwtHelperService();
  public user: Observable<any>|any;
  private userData = new BehaviorSubject(null);
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  public reloadSolicitudes: boolean = false;
  public solicitudesInitialized: boolean = false;
  public backgroundActionRunning: boolean = false;

  constructor(private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private messagesService: MessagesService) {
    SecurityService.refreshAES();
  }

  static stringifyWithAccent(json: any, emit_unicode?: string) {
    let text = JSON.stringify(json);
    return emit_unicode ? text : text.replace(/[\u007f-\uffff]/g,
      function (c) {
        return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
      }
    );
  }

  private setAuthHeader(token: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${SecurityService.encryptAes(token)}`
      })
    };
  }

  cleanUserData() {
    this.userData.next(null);
  }

  cleanAuthHeader() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  getUser() {
    return this.userData.getValue();
  }

  loadStoredToken(token: string) {
    if (token) {
      this.user = of(true);
      const decoded = this.helper.decodeToken(token);
      this.userData.next(decoded);
      this.storageService.set(StorageService.TOKEN, SecurityService.encryptRsa(JSON.stringify({ token, correo: decoded.correo })).data);
      this.setAuthHeader(token);
    }
  }

  errorHandl(error: any) {
    const err = {
      status: error.status,
      message: error.status !== 0 ? error.error.message : "No se pudo conectar con el servidor"
    };
    return throwError(() => {
      return err;
    });
  }

  errorSubscription(error: any) {
    if (error.status === 401) {
      this.storageService.remove(StorageService.TOKEN);
      this.router.navigateByUrl('/');
      this.user = of(false);
      this.userData.next(null);
    }
    this.messagesService.presentAlert(error.message);
  }

  handleResponse(response: any) {
    const { data } = response;
    const { refresh_token, ...extra } = SecurityService.decryptAes(data);
    if (refresh_token) {
      this.loadStoredToken(refresh_token);
    }
    return extra;
  }

  private getEncryptedData(data: any, includeAES: boolean = true, urlSafe: boolean = false) {
    return SecurityService.encryptRsa(ApiService.stringifyWithAccent({ aes: includeAES ? SecurityService.getAES() : null, data }), urlSafe);
  }

  private getAESForQuery() {
    return SecurityService.encryptRsa(ApiService.stringifyWithAccent(SecurityService.getAES()), true).data;
  }

  SecureGetCedula(data: any): Observable<any> {
    return this.http
      .get<any>(`${ApiService.BASE_URL}/auth/cedula?data=${this.getEncryptedData(data, true, true).data}`, this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  SecurePostRegistrar(data: any): Observable<any> {
    return this.http
      .post<any>(`${ApiService.BASE_URL}/auth/registro`, this.getEncryptedData(data, false), this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  SecurePostLogin(data: any): Observable<any> {
    SecurityService.refreshAES();
    return this.http
      .post<any>(`${ApiService.BASE_URL}/auth/login`, this.getEncryptedData(data), this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  SecurePostPass(data: any): Observable<any> {
    return this.http
      .post<any>(`${ApiService.BASE_URL}/auth/update-password`, this.getEncryptedData(data), this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  SecureResetPass(data: any): Observable<any> {
    return this.http
      .post<any>(`${ApiService.BASE_URL}/auth/reset-password`, this.getEncryptedData(data), this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  SecurePostNotificationToken(data: any): Observable<any> {
    return this.http
      .post<any>(`${ApiService.BASE_URL}/auth/notification-token`, this.getEncryptedData(data), this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  GetCategorias(): Observable<any> {
    return this.http
      .get<any>(`${ApiService.BASE_URL}/categorias?aes=${this.getAESForQuery()}`, this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  GetSubcategorias(): Observable<any> {
    return this.http
      .get<any>(`${ApiService.BASE_URL}/subcategorias?aes=${this.getAESForQuery()}`, this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  PostSolicitud(data: any): Observable<any> {
    return this.http
      .post<any>(`${ApiService.BASE_URL}/solicitudes`, data, this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  GetSolicitudes(page: number): Observable<any> {
    return this.http
      .get<any>(`${ApiService.BASE_URL}/solicitudes?aes=${this.getAESForQuery()}&page=${page}`, this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  GetSolicitud(id: number): Observable<any> {
    return this.http
      .get<any>(`${ApiService.BASE_URL}/solicitudes?aes=${this.getAESForQuery()}&id=${id}`, this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  SecurePostLogout(): Observable<any> {
    return this.http
      .post<any>(`${ApiService.BASE_URL}/auth/logout`, this.getEncryptedData(null), this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }

  SecurePostResumeSession(data: any): Observable<any> {
    const body = {
      encAES: SecurityService.encryptRsa(JSON.stringify(SecurityService.getAES())).data,
      encToken: SecurityService.encryptAes(data.encToken),
      path: data.path
    };
    return this.http
      .post<any>(`${ApiService.BASE_URL}/auth/resume-session`, body, this.httpOptions)
      .pipe(catchError(this.errorHandl));
  }
}
