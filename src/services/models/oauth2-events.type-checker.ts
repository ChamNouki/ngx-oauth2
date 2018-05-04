import {
  IOAuth2Event,
  IUserInfoRecoveredEvent,
  ILoginFailedEvent,
  ILoggedInEvent
} from './oauth2-events.interface';
import { OAuth2Events } from './oauth2-events.enum';

export function isIUserInfoRecoveredEventOrILoginFailedEvent(event: IOAuth2Event)
  : event is (IUserInfoRecoveredEvent | ILoginFailedEvent) {
  return event.action === OAuth2Events.USER_INFO_RECOVERED
    || event.action === OAuth2Events.LOGIN_FAILED;
}

export function isILoggedInEventOrILoginFailedEvent(event: IOAuth2Event)
  : event is (ILoggedInEvent | ILoginFailedEvent) {
  return event.action === OAuth2Events.LOGGED_IN
    || event.action === OAuth2Events.LOGIN_FAILED;
}
