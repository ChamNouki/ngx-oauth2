export interface IOAuth2ClientConfig {
  clientId: string;
  authorizationEndpoint: string;
  endSessionEndpoint?: string;
  userInfoEndpoint?: string;

  apiKeys?: {[urlPattern: string]: string};
}

export class OAuth2ClientConfig implements IOAuth2ClientConfig {
  public clientId: string;
  public authorizationEndpoint: string;
  public endSessionEndpoint?: string;
  public userInfoEndpoint?: string;

  public apiKeys?: { [urlPattern: string]: string };
}
