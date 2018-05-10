import {OAuth2Events} from './oauth2-events.enum';

export interface ILoggedInEvent {
  action: OAuth2Events.LOGGED_IN;
  token: Map<string, string>;
}

export interface IUserInfoRecoveredEvent {
  action: OAuth2Events.USER_INFO_RECOVERED;
  user: any;
}

export interface ILoginFailedEvent {
  action: OAuth2Events.LOGIN_FAILED;
  error: any;
}

export interface ISimpleAuthEvent {
  action: OAuth2Events.LOGGIN_REQUIRED | OAuth2Events.USER_INFO_REQUIRED | OAuth2Events.LOGGOUT_REQUIRED | OAuth2Events.LOGGED_OUT;
}

export type IOAuth2Event = ILoggedInEvent | IUserInfoRecoveredEvent | ILoginFailedEvent | ISimpleAuthEvent;
