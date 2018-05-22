import {
  OAuth2Event,
  UserInfoRecoveredEvent,
  AuthenticationFailedEvent,
  AuthenticatedEvent
} from './oauth2-events.interface';
import { OAuth2Events } from './oauth2-events.enum';

export function isUserInfoRecoveredEventOrAuthenticationFailedEvent(event: OAuth2Event)
  : event is (UserInfoRecoveredEvent | AuthenticationFailedEvent) {
  return event.action === OAuth2Events.USER_INFO_RECOVERED
    || event.action === OAuth2Events.AUTHENTICATION_FAILED;
}

export function isAuthenticatedEventOrAuthenticationFailedEvent(event: OAuth2Event)
  : event is (AuthenticatedEvent | AuthenticationFailedEvent) {
  return event.action === OAuth2Events.AUTHENTICATED
    || event.action === OAuth2Events.AUTHENTICATION_FAILED;
}
