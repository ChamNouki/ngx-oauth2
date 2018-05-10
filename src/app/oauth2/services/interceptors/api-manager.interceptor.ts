import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OAuth2ConfigService } from '../oauth2-config.service';

export class APIManagerInterceptor implements HttpInterceptor {
  constructor(private config: OAuth2ConfigService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let apiKey;
    if (this.config.apiKeys) {
      apiKey = Object.keys(this.config.apiKeys).filter((urlPattern: string) => {
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