import * as Moment from 'moment';
const moment = Moment;
import { Injectable } from '@angular/core';
import { OAuth2Events } from './models/oauth2-events.enum';
import { IOAuth2Event } from './models/oauth2-events.interface';
import { OAuth2EventFlow } from './oauth2-event-flow.service';
import { OAuth2Token } from './models/oauth2-token.model';

@Injectable()
export class OAuth2TokenService {
  private token: OAuth2Token;

  constructor(private eventFlow: OAuth2EventFlow) {
    this.eventFlow.flow.subscribe((event: IOAuth2Event) => {
      switch (event.action) {
        case OAuth2Events.LOGGED_IN:
          break;
        case OAuth2Events.LOGGOUT_REQUIRED:
        case OAuth2Events.LOGIN_FAILED:
          this.reset();
      }
    });
  }

  public getAuthorizationHeader(): string {
    return this.token.getAuthorization();
  }

  public setToken(tokenMap: Map<string, string>) {
    this.token = new OAuth2Token(tokenMap);
  }

  public getToken(): OAuth2Token {
    return this.token;
  }

  public isValid(): boolean {
    return this.token && this.token.isValid();
  }

  public isNotTooRecent(): boolean {
    return this.token && moment().isBefore(this.token.receivedAt.add(1, 'minutes'));
  }

  public reset() {
    delete this.token;
  }
}
