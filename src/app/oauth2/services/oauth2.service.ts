import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { OAuth2EventFlow } from './oauth2-event-flow.service';
import { OAuth2UserService } from './oauth2-user.service';
import { OAuth2TokenService } from './oauth2-token.service';
import { OAuth2ConfigService } from './oauth2-config.service';
import { OAuth2Token } from './models/oauth2-token.model';

@Injectable()
export class OAuth2Service {
  constructor(private config: OAuth2ConfigService,
    private tokenService: OAuth2TokenService,
    private userService: OAuth2UserService,
    private eventFlowService: OAuth2EventFlow) {
  }

  public isConnected(): boolean {
    return this.tokenService.isValid() && (!this.config.userManagement || this.userService.hasInfo());
  }

  public login(): Observable<Map<string, string>>;
  public login<T>(): Observable<T>;
  public login<T>(): Observable<T | Map<string, string>> {
    return this.eventFlowService.requireLogin();
  }

  public logout(): Observable<{}> {
    return this.eventFlowService.requireLogout();
  }

  public userInfo<T>(): Observable<T> {
    if (this.config.userManagement) {
      return from(this.userService.getUser<T>());
    }
    return throwError('User management is not activated cause userEndpoint config is not set.');
  }

  public token(): OAuth2Token {
    return this.tokenService.getToken();
  }
}
