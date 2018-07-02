import { Injectable } from '@angular/core';
import * as momentImported from 'moment';
import { OIDCEvents } from '../models/oidc-events.enum';
import { OIDCEvent } from '../models/oidc-events.interface';
import { OIDCConfigService } from './oidc-config.service';
import { OIDCEventFlow } from './oidc-event-flow.service';

const moment = momentImported;

@Injectable()
export class OIDCTokenService {

  public access_token?: string;
  public id_token?: string;
  public session_state?: string;

  public static decodeToken(token: string): any[] {
    const base64Header = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/');
    const base64Body = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const header = JSON.parse(atob(base64Header));
    const body = JSON.parse(atob(base64Body));
    return [header, body];
  }

  constructor(private eventFlow: OIDCEventFlow, private config: OIDCConfigService) {
    this.eventFlow.flow.subscribe((event: OIDCEvent) => {
      switch (event.action) {
        case OIDCEvents.AUTHENTICATION_DATA_RECEIVED:
          this.setToken(event.params);
          break;
        case OIDCEvents.SESSION_END_REQUIRED:
        case OIDCEvents.AUTHENTICATION_FAILED:
          this.reset();
      }
    });
  }

  public getAuthorizationHeader(): string {
    if (!this.access_token) {
      throw new Error('No access_token available.');
    }

    const [header, body] = OIDCTokenService.decodeToken(this.access_token);
    return `${body.typ} ${this.access_token}`;
  }

  public setToken(params: Map<string, string>) {
    this.access_token = params.get('access_token');
    this.id_token = params.get('id_token');
    this.session_state = params.get('session_state');

    try {
      this.validateIdToken();
      this.eventFlow.authenticated();
    } catch (error) {
      this.eventFlow.failedToAuthenticate(error);
    }
  }

  public hasNotExpired(): boolean {
    if (!this.access_token) {
      return false;
    }
    const [header, body] = OIDCTokenService.decodeToken(this.access_token);
    const exp = moment.unix(body.exp);
    return exp.isBefore(moment());
  }

  public isNotTooRecent(): boolean {
    if (!this.access_token) {
      return false;
    }
    const [header, body] = OIDCTokenService.decodeToken(this.access_token);
    const iat = moment.unix(body.iat);
    return moment().isAfter(iat.add(1, 'minutes'));
  }

  public reset() {
    delete this.access_token;
    delete this.id_token;
    delete this.session_state;
  }

  private validateIdToken() {
    const [header, body] = OIDCTokenService.decodeToken(this.id_token);

    if (body.nonce !== this.config.nonce) {
      throw new Error('ID token does not seems to be valide.');
    }
  }
}
