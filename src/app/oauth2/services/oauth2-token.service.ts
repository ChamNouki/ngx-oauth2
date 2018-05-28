import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { OAuth2Events } from '../models/oauth2-events.enum';
import { OAuth2Event } from '../models/oauth2-events.interface';
import { OpenIdUser } from '../models/openid-user';
import { OAuth2ConfigService } from './oauth2-config.service';
import { OAuth2EventFlow } from './oauth2-event-flow.service';



@Injectable()
export class OAuth2TokenService {

  public access_token?: string;
  public id_token?: string;
  public session_state?: string;
  public receivedAt: moment.Moment;

  public static decodeToken(token: string): any[] {
    const base64Header = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/');
    const base64Body = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const header = JSON.parse(atob(base64Header));
    const body = JSON.parse(atob(base64Body));
    return [header, body];
  }

  constructor(private eventFlow: OAuth2EventFlow, private config: OAuth2ConfigService) {
    this.eventFlow.flow.subscribe((event: OAuth2Event) => {
      switch (event.action) {
        case OAuth2Events.AUTHENTICATION_DATA_RECEIVED:
          this.setToken(event.params);
          break;
        case OAuth2Events.SESSION_END_REQUIRED:
        case OAuth2Events.AUTHENTICATION_FAILED:
          this.reset();
      }
    });
  }

  public getAuthorizationHeader(): string {
    if (!this.access_token) {
      throw new Error('No access_token available.');
    }

    const [header, body] = OAuth2TokenService.decodeToken(this.access_token);
    return `${body.typ} ${this.access_token}`;
  }

  public getUserInfo(): OpenIdUser {
    if (!this.id_token) {
      throw new Error('No id_token available.');
    }

    const [header, body] = OAuth2TokenService.decodeToken(this.id_token);
    return Object.keys(body)
      .filter(key => OpenIdUser.includes(key))
      .reduce((user, key) => {
        user[key] = body[key];
        return user;
      }, {} as OpenIdUser);
  }

  public setToken(params: Map<string, string>) {
    this.access_token = params.get('access_token');
    this.id_token = params.get('id_token');
    this.session_state = params.get('session_state');
    this.receivedAt = moment.utc();

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
    const [header, body] = OAuth2TokenService.decodeToken(this.access_token);
    const exp = moment(body.exp);
    return exp.isBefore(moment());
  }

  public isNotTooRecent(): boolean {
    if (!this.access_token) {
      return false;
    }
    const [header, body] = OAuth2TokenService.decodeToken(this.access_token);
    const iat = moment(body.iat);
    return moment().isAfter(iat.add(1, 'minutes'));
  }

  public reset() {
    delete this.access_token;
    delete this.id_token;
    delete this.session_state;
    delete this.receivedAt;
  }

  private validateIdToken() {
    const [header, body] = OAuth2TokenService.decodeToken(this.id_token);

    if (body.nonce !== this.config.nonce) {
      throw new Error('ID token does not seems to be valide.');
    }
  }
}
