import { OAuth2Events } from './oauth2-events.enum';

export interface AuthenticatedEvent {
  action: OAuth2Events.AUTHENTICATED;
  params: Map<string, string>;
}

export interface UserInfoRecoveredEvent {
  action: OAuth2Events.USER_INFO_RECOVERED;
  user: any;
}

export interface AuthenticationFailedEvent {
  action: OAuth2Events.AUTHENTICATION_FAILED;
  error: any;
}

export interface SimpleAuthEvent {
  action: OAuth2Events.AUTHENTICATION_REQUIRED
  | OAuth2Events.USER_INFO_REQUIRED
  | OAuth2Events.SESSION_END_REQUIRED
  | OAuth2Events.SESSION_ENDED;
}

export type OAuth2Event = AuthenticatedEvent | UserInfoRecoveredEvent | AuthenticationFailedEvent | SimpleAuthEvent;
