import {Injectable, Injector} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';
import {AuthenticationService} from '../_services/authentication.service';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {LoginComponent} from '../login/login.component';
import {environment} from '../../environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (d.g. refresh pending).
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private isShowLoginModal = false;
  private whiteListUrl = [environment.CHAT_SERVER_URL + '/upload'];

  constructor(private router: Router, private authenticationService: AuthenticationService, private cookieService: CookieService,
              private loginComponent: LoginComponent, private injector: Injector) {
  }

  getAccessToken() {
    if (this.authenticationService.isAuthenticated()) {
      const json = JSON.parse('' + window.sessionStorage.getItem('token'));
      return json.token_type + ' ' + json.access_token;
    } else {
      return 'Basic ' + btoa(environment.CLIENT_ID + ':' + environment.CLIENT_SECRET);
    }
  }
  getSessionId(){
    return window.sessionStorage.getItem('session_id')+'';
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(request.url);
    if(this.whiteListUrl.includes(request.url)){
      request = request.clone({
        setHeaders: {
          'Accept-Language': sessionStorage.getItem('lang' + environment.CLIENT_ID) + '',
          // 'X-Openerp-Session-Id':this.getSessionId(),
        },
        // withCredentials:true,
      });
    } else{
      request = request.clone({
        setHeaders: {
          'Accept-Language': sessionStorage.getItem('lang' + environment.CLIENT_ID) + '',
          Authorization: this.getAccessToken(),
          // 'X-Openerp-Session-Id':this.getSessionId(),
        },
        // withCredentials:true,
      });
    }


    return next.handle(request).pipe(
      catchError((err: any) => {
          if (err.status === 401) {
            console.log(401);
            if (!this.refreshTokenInProgress) {
              this.refreshTokenInProgress = true;
              this.process401Error();
              return this.tokenSubject
                .pipe(
                  filter(token => token != null),
                  take(1),
                  switchMap(token => {
                    this.refreshTokenInProgress = false;
                    this.isShowLoginModal = false;
                    return next.handle(this.setAuthHeader(request));
                  }),
                );
            }
            return throwError(err);
          } else {
            const error = err.error.message || err.error.error;
            return throwError(error);
          }
        },
      ),
    );
  }

  private setAuthHeader(request: HttpRequest<any>) {
    return request.clone({url: request.url, setHeaders: {
        'Accept-Language': sessionStorage.getItem('lang' + environment.CLIENT_ID) + '',
        Authorization: this.getAccessToken(),
      },
      withCredentials:true,});
  }
  process401Error() {
    console.log('process401Error', this.tokenSubject);
    const tk = window.sessionStorage.getItem('token');
    console.log('Token', tk);
    if (tk) {
      console.log('refresh token:', tk);
      this.refreshToken().subscribe((newToken:any) => {
          if (newToken) {

            newToken.access_token = window.sessionStorage.getItem('tokenChat');

            const parse = JSON.parse(newToken);
            parse.access_token = window.sessionStorage.getItem('tokenChat');
            window.sessionStorage.setItem('token', JSON.stringify(parse));


            console.log('new token:', newToken);
            this.tokenSubject.next('1');
          }
        }, error => {
          console.log('refreshTokenError', error);
          window.sessionStorage.removeItem('token');
          this.process401Error();
        },
      );
    } else {
      if (!this.isShowLoginModal) {
        this.isShowLoginModal = true;
        const dlgRef = this.loginComponent.showLoginModal();
        dlgRef.afterClosed().subscribe(result => {
          if (window.sessionStorage.getItem('token')) {
            this.refreshTokenInProgress = false;
            this.isShowLoginModal = false;
            this.tokenSubject.next('1');
          }
        });
      }
    }
  }

  refreshToken() {
    const http = this.injector.get(HttpClient);
    const refresh_token = JSON.parse('' + window.sessionStorage.getItem('token')).refresh_token;
    window.sessionStorage.removeItem('token');
    const headers = {
      'Content-type': 'application/x-www-form-urlencoded',
    };
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('refresh_token', refresh_token);
    return http.post(environment.BASE_AUTHORIZATION_URL + '/oauth/token', body.toString(), {headers});
  }
}
