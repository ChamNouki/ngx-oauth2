import { Injectable } from '@angular/core';
import { Observable, Subject, of, throwError, empty } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { IOAuth2Event } from './models/oauth2-events.interface';
import { OAuth2Events } from './models/oauth2-events.enum';
import {
  ILoginFailedEvent,
  ILoggedInEvent,
  IUserInfoRecoveredEvent
} from './models/oauth2-events.interface';
import {
  isIUserInfoRecoveredEventOrILoginFailedEvent,
  isILoggedInEventOrILoginFailedEvent
} from './models/oauth2-events.type-checker';
import { OAuth2ConfigService } from './oauth2-config.service';

@Injectable()
export class OAuth2EventFlow {
  private eventFlow = new Subject<IOAuth2Event>();

  get flow(): Observable<any> {
    return this.eventFlow;
  }

  constructor(private config: OAuth2ConfigService) {
  }

  // Triggers
  public requireLogin<T>() {
    this.eventFlow.next({ action: OAuth2Events.LOGGIN_REQUIRED });

    if (this.config.userManagement) {
      return this.eventFlow.pipe(

        filter(isIUserInfoRecoveredEventOrILoginFailedEvent),

        mergeMap((event: IUserInfoRecoveredEvent | ILoginFailedEvent) => {
          if (event.action === OAuth2Events.LOGIN_FAILED) {
            return throwError(event.error);
          }
          return of(event.user);
        })

      );
    }

    return this.eventFlow.pipe(

      filter<IOAuth2Event, ILoggedInEvent | ILoginFailedEvent>(isILoggedInEventOrILoginFailedEvent),

      mergeMap((event: ILoggedInEvent | ILoginFailedEvent) => {
        if (event.action === OAuth2Events.LOGIN_FAILED) {
          return throwError(event.error);
        }
        return of(event.token);
      })

    );
  }

  public requireLogout() {
    this.eventFlow.next({ action: OAuth2Events.LOGGOUT_REQUIRED });

    return this.eventFlow.pipe(
      filter((event: IOAuth2Event) => event.action === OAuth2Events.LOGGED_OUT),
      mergeMap((event: IOAuth2Event) => empty())
    );
  }

  // Notifiers
  public loggedIn(token: Map<string, string>) {
    this.eventFlow.next({ action: OAuth2Events.LOGGED_IN, token });

    if (this.config.userManagement) {
      this.eventFlow.next({ action: OAuth2Events.USER_INFO_REQUIRED });
    }
  }

  public userInfoRecovered(user: any) {
    this.eventFlow.next({ action: OAuth2Events.USER_INFO_RECOVERED, user });
  }

  public failedToLogin(error: any) {
    this.eventFlow.next({ action: OAuth2Events.LOGIN_FAILED, error });
  }

  public loggedOut() {
    this.eventFlow.next({ action: OAuth2Events.LOGGED_OUT });
  }
}
