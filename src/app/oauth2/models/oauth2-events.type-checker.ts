import { OAuth2Events } from './oauth2-events.enum';
import {
  AuthenticatedEvent,
  AuthenticationFailedEvent,
  OAuth2Event,
  SessionEndedEvent,
  UserInfoReceivedEvent,
} from './oauth2-events.interface';

export function isUserInfoReceivedEventOrAuthenticationFailedEvent(event: OAuth2Event)
  : event is (UserInfoReceivedEvent | AuthenticationFailedEvent) {
  return event.action === OAuth2Events.USER_INFO_RECEIVED
    || event.action === OAuth2Events.AUTHENTICATION_FAILED;
}

export function isAuthenticatedEventOrAuthenticationFailedEvent(event: OAuth2Event)
  : event is (AuthenticatedEvent | AuthenticationFailedEvent) {
  return event.action === OAuth2Events.AUTHENTICATED
    || event.action === OAuth2Events.AUTHENTICATION_FAILED;
}

export function isSessionEndedEventOrAuthenticationFailedEvent(event: OAuth2Event)
  : event is (SessionEndedEvent | AuthenticationFailedEvent) {
  return event.action === OAuth2Events.SESSION_ENDED
    || event.action === OAuth2Events.AUTHENTICATION_FAILED;
}
