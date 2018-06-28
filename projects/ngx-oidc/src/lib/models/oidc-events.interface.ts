import { OIDCEvents } from './oidc-events.enum';
import { OpenIdUser } from './openid-user';

export interface AuthenticationDataReceivedEvent {
  action: OIDCEvents.AUTHENTICATION_DATA_RECEIVED;
  params: Map<string, string>;
}

export interface AuthenticationFailedEvent {
  action: OIDCEvents.AUTHENTICATION_FAILED;
  error: any;
}

export interface AuthenticatedEvent {
  action: OIDCEvents.AUTHENTICATED;
}

export interface UserInfoReceivedEvent {
  action: OIDCEvents.USER_INFO_RECEIVED;
  user: OpenIdUser;
}

export interface SessionEndedEvent {
  action: OIDCEvents.SESSION_ENDED;
}

export interface SimpleAuthEvent {
  action: OIDCEvents.AUTHENTICATION_REQUIRED
  | OIDCEvents.USER_INFO_REQUIRED
  | OIDCEvents.SESSION_END_REQUIRED;
}

export type OIDCEvent = AuthenticatedEvent
  | AuthenticationDataReceivedEvent
  | AuthenticationFailedEvent
  | UserInfoReceivedEvent
  | SessionEndedEvent
  | SimpleAuthEvent;
