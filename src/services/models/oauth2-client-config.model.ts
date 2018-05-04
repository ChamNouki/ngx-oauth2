export interface IOAuth2ClientConfig {
  clientId: string;
  apiKeys?: {[urlPattern: string]: string};
  loginEndpoint: string;
  logoutEndpoint?: string;
  userEndpoint?: string;
}

export class OAuth2ClientConfig implements IOAuth2ClientConfig {
  public clientId: string;
  public apiKeys?: {[urlPattern: string]: string};
  public loginEndpoint: string;
  public logoutEndpoint?: string;
  public userEndpoint?: string;
}
