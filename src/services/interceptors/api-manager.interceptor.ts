import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
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

    return next.handle(req)
      .catch((err: any) => {
        // TODO need to know if errors cames from the API Manager or the API itself
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return Observable.throw(err.error ? err.error.message : err.message);
        } else if (err instanceof HttpErrorResponse && err.status === 403) {
          return Observable.throw(err.error ? err.error.message : err.message);
        } else {
          return Observable.throw(err);
        }
      });
  }
}
