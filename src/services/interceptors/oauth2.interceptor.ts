import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { OAuth2HandlerService } from '../oauth2-handler.service';
import { OAuth2TokenService } from '../oauth2-token.service';

@Injectable()
export class OAuth2Interceptor implements HttpInterceptor {
  constructor(private handlerService: OAuth2HandlerService, private tokenService: OAuth2TokenService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return Observable
      .defer(() => {
        if (this.tokenService.isValid()) {
          req = req.clone({
            setHeaders: {
              Authorization: this.tokenService.getAuthorizationHeader()
            }
          });
        }

        return next.handle(req);
      })
      .retryWhen((attempts) => {
        return this.handlerService.handle401(attempts);
      });
  }
}
