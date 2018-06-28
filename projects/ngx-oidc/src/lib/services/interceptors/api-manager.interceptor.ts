import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OIDCConfigService } from '../oidc-config.service';
import { Injectable } from '@angular/core';

@Injectable()
export class APIManagerInterceptor implements HttpInterceptor {
  constructor(private config: OIDCConfigService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiKey;
    if (this.config.api_keys) {
      apiKey = Object.keys(this.config.api_keys).filter((urlPattern: string) => {
        new RegExp(urlPattern).test(req.url);
      })[0];
    }

    if (apiKey) {
      req = req.clone({
        headers: req.headers.set('X-Api-Key', apiKey)
      });
    }

    return next.handle(req).pipe(
      catchError((err: any) => {
        // TODO need to know if errors cames from an API Manager or the API itself
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return throwError(err.error ? err.error.message : err.message);

        } else if (err instanceof HttpErrorResponse && err.status === 403) {
          return throwError(err.error ? err.error.message : err.message);

        } else {
          return throwError(err);
        }
      })
    );
  }
}
