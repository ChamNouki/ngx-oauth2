import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { OIDCEvents } from '../models/oidc-events.enum';
import { OIDCEvent } from '../models/oidc-events.interface';
import { OpenIdUser } from '../models/openid-user';
import { OIDCConfigService } from './oidc-config.service';
import { OIDCEventFlow } from './oidc-event-flow.service';


@Injectable({
  providedIn: 'root'
})
export class OIDCUserService {
  private user: any;

  constructor(private http: HttpClient, private config: OIDCConfigService, private eventFlow: OIDCEventFlow) {
    this.eventFlow.flow.subscribe((event: OIDCEvent) => {
      switch (event.action) {
        case OIDCEvents.USER_INFO_REQUIRED:
          this.getUser();
          break;
        case OIDCEvents.SESSION_END_REQUIRED:
        case OIDCEvents.AUTHENTICATION_FAILED:
          this.reset();
      }
    });
  }

  public async getUser(): Promise<OpenIdUser> {
    if (!this.config.userinfo_endpoint) {
      throw new Error('No user endpoint in configuration');
    }

    try {
      this.user = await this.http.get<OpenIdUser>(this.config.userinfo_endpoint).toPromise();
      this.eventFlow.userInfoReceived(this.user);
    } catch (error) {
      this.eventFlow.failedToAuthenticate(error);
      throw error;
    }

    return this.user;
  }

  public hasInfo(): boolean {
    return this.user != null;
  }

  public reset() {
    delete this.user;
  }
}
