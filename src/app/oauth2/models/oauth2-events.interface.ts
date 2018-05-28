import { OAuth2Events } from './oauth2-events.enum';
import { OpenIdUser } from './openid-user';

export interface AuthenticationDataReceivedEvent {
  action: OAuth2Events.AUTHENTICATION_DATA_RECEIVED;
  params: Map<string, string>;
}

export interface AuthenticationFailedEvent {
  action: OAuth2Events.AUTHENTICATION_FAILED;
  error: any;
}

export interface AuthenticatedEvent {
  action: OAuth2Events.AUTHENTICATED;
}

export interface UserInfoReceivedEvent {
  action: OAuth2Events.USER_INFO_RECEIVED;
  user: OpenIdUser;
}

export interface SessionEndedEvent {
  action: OAuth2Events.SESSION_ENDED;
}

export interface SimpleAuthEvent {
  action: OAuth2Events.AUTHENTICATION_REQUIRED
  | OAuth2Events.USER_INFO_REQUIRED
  | OAuth2Events.SESSION_END_REQUIRED;
}

export type OAuth2Event = AuthenticatedEvent
  | AuthenticationDataReceivedEvent
  | AuthenticationFailedEvent
  | UserInfoReceivedEvent
  | SessionEndedEvent
  | SimpleAuthEvent;
