import { Injectable } from '@angular/core';
import { Observable, Subject, of, throwError, EMPTY } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { OAuth2Event } from './models/oauth2-events.interface';
import { OAuth2Events } from './models/oauth2-events.enum';
import {
  AuthenticationFailedEvent,
  AuthenticatedEvent,
  UserInfoRecoveredEvent
} from './models/oauth2-events.interface';
import {
  isUserInfoRecoveredEventOrAuthenticationFailedEvent,
  isAuthenticatedEventOrAuthenticationFailedEvent
} from './models/oauth2-events.type-checker';
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
  public requireAuthentication<T>() {
    this.eventFlow.next({ action: OAuth2Events.AUTHENTICATION_REQUIRED });

    if (this.config.userManagement) {
      return this.eventFlow.pipe(

        filter(isUserInfoRecoveredEventOrAuthenticationFailedEvent),

        mergeMap((event: UserInfoRecoveredEvent | AuthenticationFailedEvent) => {
          if (event.action === OAuth2Events.AUTHENTICATION_FAILED) {
            return throwError(event.error);
          }
          return of(event.user);
        })

      );
    }

    return this.eventFlow.pipe(

      filter<OAuth2Event, AuthenticatedEvent | AuthenticationFailedEvent>(isAuthenticatedEventOrAuthenticationFailedEvent),

      mergeMap((event: AuthenticatedEvent | AuthenticationFailedEvent) => {
        if (event.action === OAuth2Events.AUTHENTICATION_FAILED) {
          return throwError(event.error);
        }
        return of(event.params);
      })

    );
  }

  public requireEndSession() {
    this.eventFlow.next({ action: OAuth2Events.SESSION_END_REQUIRED });

    return this.eventFlow.pipe(
      filter((event: OAuth2Event) => event.action === OAuth2Events.SESSION_ENDED),
      mergeMap((event: OAuth2Event) => EMPTY)
    );
  }

  // Notifiers
  public authenticated(params: Map<string, string>) {
    this.eventFlow.next({ action: OAuth2Events.AUTHENTICATED, params });

    if (this.config.userManagement) {
      this.eventFlow.next({ action: OAuth2Events.USER_INFO_REQUIRED });
    }
  }

  public userInfoRecovered(user: any) {
    this.eventFlow.next({ action: OAuth2Events.USER_INFO_RECOVERED, user });
  }

  public failedToAuthenticate(error: any) {
    this.eventFlow.next({ action: OAuth2Events.AUTHENTICATION_FAILED, error });
  }

  public sessionEnded() {
    this.eventFlow.next({ action: OAuth2Events.SESSION_ENDED });
  }
}
