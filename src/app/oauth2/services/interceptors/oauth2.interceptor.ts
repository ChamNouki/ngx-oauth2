import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, Observable, of, throwError } from 'rxjs';
import { mergeMap, retryWhen, scan, switchMap, takeWhile } from 'rxjs/operators';

import { OpenIdUser } from '../../models/openid-user';
import { OAuth2Service } from './../oauth2.service';

@Injectable()
export class OAuth2Interceptor implements HttpInterceptor {
  constructor(private authService: OAuth2Service) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return defer(
      () => {
        if (this.authService.isConnected()) {
          req = req.clone({
            setHeaders: {
              Authorization: this.authService.getAuthorizationHeader()
            }
          });
        }

        return next.handle(req);
      }
    ).pipe(
      retryWhen((attempts) => {
        return this.handle401(attempts);
      })
    );
  }

  private handle401<T>(attempts: Observable<any>): Observable<void | OpenIdUser> {
    return attempts.pipe(
      switchMap((error: any) => {
        // TODO in the futur need to know if error cames from an API Manager or from the API itself
        if (error.status === 401) {
          return of(error);
        }
        return throwError(error);
      }),
      scan((acc, value) => {
        return acc + 1;
      }, 0),
      takeWhile((acc) => acc < 2),
      mergeMap(() => {
        return this.authService.login();
      })
    );
  }
}
