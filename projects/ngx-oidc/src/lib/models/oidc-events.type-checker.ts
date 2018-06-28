import { OIDCEvents } from './oidc-events.enum';
import {
  AuthenticatedEvent,
  AuthenticationFailedEvent,
  OIDCEvent,
  SessionEndedEvent,
  UserInfoReceivedEvent,
} from './oidc-events.interface';

export function isUserInfoReceivedEventOrAuthenticationFailedEvent(event: OIDCEvent)
  : event is (UserInfoReceivedEvent | AuthenticationFailedEvent) {
  return event.action === OIDCEvents.USER_INFO_RECEIVED
    || event.action === OIDCEvents.AUTHENTICATION_FAILED;
}

export function isAuthenticatedEventOrAuthenticationFailedEvent(event: OIDCEvent)
  : event is (AuthenticatedEvent | AuthenticationFailedEvent) {
  return event.action === OIDCEvents.AUTHENTICATED
    || event.action === OIDCEvents.AUTHENTICATION_FAILED;
}

export function isSessionEndedEventOrAuthenticationFailedEvent(event: OIDCEvent)
  : event is (SessionEndedEvent | AuthenticationFailedEvent) {
  return event.action === OIDCEvents.SESSION_ENDED
    || event.action === OIDCEvents.AUTHENTICATION_FAILED;
}
