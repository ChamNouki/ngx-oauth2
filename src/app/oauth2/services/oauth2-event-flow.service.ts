import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { OAuth2Events } from '../models/oauth2-events.enum';
import { AuthenticatedEvent, AuthenticationFailedEvent, OAuth2Event } from '../models/oauth2-events.interface';
import {
  isAuthenticatedEventOrAuthenticationFailedEvent,
  isSessionEndedEventOrAuthenticationFailedEvent,
  isUserInfoReceivedEventOrAuthenticationFailedEvent,
} from '../models/oauth2-events.type-checker';
import { OpenIdUser } from '../models/openid-user';
import { UserInfoReceivedEvent } from './../models/oauth2-events.interface';
import { OAuth2ConfigService } from './oauth2-config.service';




@Injectable()
export class OAuth2EventFlow {
  private eventFlow = new Subject<OAuth2Event>();

  get flow(): Observable<any> {
    return this.eventFlow;
  }

  constructor(private config: OAuth2ConfigService) {
  }

  // Triggers
  public requireAuthentication(): Observable<void | OpenIdUser> {
    this.eventFlow.next({ action: OAuth2Events.AUTHENTICATION_REQUIRED });

    if (this.config.userinfo_endpoint) {
      return this.eventFlow.pipe(
        filter(isUserInfoReceivedEventOrAuthenticationFailedEvent),
        map(this.mapToUser)
      );
    }

    return this.eventFlow.pipe(
      filter(isAuthenticatedEventOrAuthenticationFailedEvent),
      map(this.mapToVoid)
    );
  }

  public requireUserInfo() {
    this.eventFlow.next({ action: OAuth2Events.USER_INFO_REQUIRED });

    return this.eventFlow.pipe(
      filter(isUserInfoReceivedEventOrAuthenticationFailedEvent),
      map(this.mapToUser)
    );
  }

  public requireEndSession(): Observable<void> {
    this.eventFlow.next({ action: OAuth2Events.SESSION_END_REQUIRED });

    return this.eventFlow.pipe(
      filter(isSessionEndedEventOrAuthenticationFailedEvent),
      map((event: OAuth2Event) => { return; })
    );
  }

  // Notifiers
  public authenticationDataReceived(params: Map<string, string>) {
    this.eventFlow.next({ action: OAuth2Events.AUTHENTICATION_DATA_RECEIVED, params });
  }

  public authenticated() {
    this.eventFlow.next({ action: OAuth2Events.AUTHENTICATED });

    if (this.config.userinfo_endpoint) {
      this.eventFlow.next({ action: OAuth2Events.USER_INFO_REQUIRED });
    }
  }

  public userInfoReceived(user: OpenIdUser) {
    this.eventFlow.next({ action: OAuth2Events.USER_INFO_RECEIVED, user });
  }

  public failedToAuthenticate(error: any) {
    this.eventFlow.next({ action: OAuth2Events.AUTHENTICATION_FAILED, error });
  }

  public sessionEnded() {
    this.eventFlow.next({ action: OAuth2Events.SESSION_ENDED });
  }

  // Mappers
  private mapToUser(event: UserInfoReceivedEvent | AuthenticationFailedEvent): OpenIdUser {
    if (event.action === OAuth2Events.AUTHENTICATION_FAILED) {
      throw event.error;
    }
    return event.user;
  }

  private mapToVoid(event: AuthenticatedEvent | AuthenticationFailedEvent): void {
    if (event.action === OAuth2Events.AUTHENTICATION_FAILED) {
      throw event.error;
    }
  }
}
