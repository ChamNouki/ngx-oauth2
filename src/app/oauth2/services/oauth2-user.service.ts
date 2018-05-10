import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuth2ConfigService } from './oauth2-config.service';
import { OAuth2EventFlow } from './oauth2-event-flow.service';
import { IOAuth2Event } from './models/oauth2-events.interface';
import { OAuth2Events } from './models/oauth2-events.enum';

@Injectable()
export class OAuth2UserService {
  private user: any;

  constructor(private http: HttpClient, private config: OAuth2ConfigService, private eventFlow: OAuth2EventFlow) {
    this.eventFlow.flow.subscribe((event: IOAuth2Event) => {
      switch (event.action) {
        case OAuth2Events.USER_INFO_REQUIRED:
          this.getUser();
          break;
        case OAuth2Events.LOGGOUT_REQUIRED:
        case OAuth2Events.LOGIN_FAILED:
          this.reset();
      }
    });
  }

  public async getUser<T>(): Promise<T> {
    if (!this.user) {
      try {
        const userInfoUrl = this.config.userInfoUrl;
        if (!userInfoUrl) {
          throw new Error('No user endpoint in configuration');
        }
        this.user = await this.http.get<T>(userInfoUrl).toPromise();
        this.eventFlow.userInfoRecovered(this.user);
      } catch (error) {
        this.eventFlow.failedToLogin(error);
        throw error;
      }
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
