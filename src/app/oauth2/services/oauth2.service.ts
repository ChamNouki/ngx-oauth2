import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OpenIdUser } from '../models/openid-user';
import { OAuth2ConfigService } from './oauth2-config.service';
import { OAuth2EventFlow } from './oauth2-event-flow.service';
import { OAuth2TokenService } from './oauth2-token.service';
import { OAuth2UserService } from './oauth2-user.service';

@Injectable()
export class OAuth2Service {
  constructor(private config: OAuth2ConfigService,
    private tokenService: OAuth2TokenService,
    private userService: OAuth2UserService,
    private eventFlowService: OAuth2EventFlow) {
  }

  public isConnected(): boolean {
    return this.tokenService.hasNotExpired();
  }

  public login(): Observable<void | OpenIdUser> {
    return this.eventFlowService.requireAuthentication();
  }

  public logout(): Observable<void> {
    return this.eventFlowService.requireEndSession();
  }

  public userInfo(): Observable<OpenIdUser> {
    return this.eventFlowService.requireUserInfo();
  }

  public getAuthorizationHeader(): string | null {
    try {
      return this.tokenService.getAuthorizationHeader();
    } catch (e) {
      return null;
    }
  }
}
