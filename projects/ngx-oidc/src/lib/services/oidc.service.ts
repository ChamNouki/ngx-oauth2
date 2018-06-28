import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OpenIdUser } from '../models/openid-user';
import { OIDCEventFlow } from './oidc-event-flow.service';
import { OIDCTokenService } from './oidc-token.service';

@Injectable({
  providedIn: 'root'
})
export class OIDCService {
  constructor(private tokenService: OIDCTokenService,
    private eventFlowService: OIDCEventFlow) {
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
