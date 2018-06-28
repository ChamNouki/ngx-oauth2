import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { OIDCEvents } from '../models/oidc-events.enum';
import { AuthenticatedEvent, AuthenticationFailedEvent, OIDCEvent } from '../models/oidc-events.interface';
import {
  isAuthenticatedEventOrAuthenticationFailedEvent,
  isSessionEndedEventOrAuthenticationFailedEvent,
  isUserInfoReceivedEventOrAuthenticationFailedEvent,
} from '../models/oidc-events.type-checker';
import { OpenIdUser } from '../models/openid-user';
import { UserInfoReceivedEvent } from './../models/oidc-events.interface';
import { OIDCConfigService } from './oidc-config.service';




@Injectable({
  providedIn: 'root'
})
export class OIDCEventFlow {
  private eventFlow = new Subject<OIDCEvent>();

  get flow(): Observable<any> {
    return this.eventFlow;
  }

  constructor(private config: OIDCConfigService) {
  }

  // Triggers
  public requireAuthentication(): Observable<void | OpenIdUser> {
    this.eventFlow.next({ action: OIDCEvents.AUTHENTICATION_REQUIRED });

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
    this.eventFlow.next({ action: OIDCEvents.USER_INFO_REQUIRED });

    return this.eventFlow.pipe(
      filter(isUserInfoReceivedEventOrAuthenticationFailedEvent),
      map(this.mapToUser)
    );
  }

  public requireEndSession(): Observable<void> {
    this.eventFlow.next({ action: OIDCEvents.SESSION_END_REQUIRED });

    return this.eventFlow.pipe(
      filter(isSessionEndedEventOrAuthenticationFailedEvent),
      map((event: OIDCEvent) => { return; })
    );
  }

  // Notifiers
  public authenticationDataReceived(params: Map<string, string>) {
    this.eventFlow.next({ action: OIDCEvents.AUTHENTICATION_DATA_RECEIVED, params });
  }

  public authenticated() {
    this.eventFlow.next({ action: OIDCEvents.AUTHENTICATED });

    if (this.config.userinfo_endpoint) {
      this.eventFlow.next({ action: OIDCEvents.USER_INFO_REQUIRED });
    }
  }

  public userInfoReceived(user: OpenIdUser) {
    this.eventFlow.next({ action: OIDCEvents.USER_INFO_RECEIVED, user });
  }

  public failedToAuthenticate(error: any) {
    this.eventFlow.next({ action: OIDCEvents.AUTHENTICATION_FAILED, error });
  }

  public sessionEnded() {
    this.eventFlow.next({ action: OIDCEvents.SESSION_ENDED });
  }

  // Mappers
  private mapToUser(event: UserInfoReceivedEvent | AuthenticationFailedEvent): OpenIdUser {
    if (event.action === OIDCEvents.AUTHENTICATION_FAILED) {
      throw event.error;
    }
    return event.user;
  }

  private mapToVoid(event: AuthenticatedEvent | AuthenticationFailedEvent): void {
    if (event.action === OIDCEvents.AUTHENTICATION_FAILED) {
      throw event.error;
    }
  }
}
