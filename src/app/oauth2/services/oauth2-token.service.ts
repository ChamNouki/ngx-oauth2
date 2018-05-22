import * as Moment from 'moment';
const moment = Moment;
import { Injectable } from '@angular/core';
import { OAuth2Events } from './models/oauth2-events.enum';
import { OAuth2Event } from './models/oauth2-events.interface';
import { OAuth2EventFlow } from './oauth2-event-flow.service';
import { OAuth2Token } from './models/oauth2-token.model';

@Injectable()
export class OAuth2TokenService {
  private token: OAuth2Token;

  constructor(private eventFlow: OAuth2EventFlow) {
    this.eventFlow.flow.subscribe((event: OAuth2Event) => {
      switch (event.action) {
        case OAuth2Events.AUTHENTICATED:
          this.setToken(event.params);
          break;
        case OAuth2Events.SESSION_END_REQUIRED:
        case OAuth2Events.AUTHENTICATION_FAILED:
          this.reset();
      }
    });
  }

  public getAuthorizationHeader(): string {
    return this.token.getAuthorization();
  }

  public setToken(params: Map<string, string>) {
    this.token = new OAuth2Token(params);
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
