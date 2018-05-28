import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { OAuth2Events } from '../models/oauth2-events.enum';
import { OAuth2Event } from '../models/oauth2-events.interface';
import { OpenIdUser } from '../models/openid-user';
import { OAuth2ConfigService } from './oauth2-config.service';
import { OAuth2EventFlow } from './oauth2-event-flow.service';


@Injectable()
export class OAuth2UserService {
  private user: any;

  constructor(private http: HttpClient, private config: OAuth2ConfigService, private eventFlow: OAuth2EventFlow) {
    this.eventFlow.flow.subscribe((event: OAuth2Event) => {
      switch (event.action) {
        case OAuth2Events.USER_INFO_REQUIRED:
          this.getUser();
          break;
        case OAuth2Events.SESSION_END_REQUIRED:
        case OAuth2Events.AUTHENTICATION_FAILED:
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
