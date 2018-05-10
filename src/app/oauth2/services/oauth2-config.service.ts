import {IOAuth2ClientConfig, OAuth2ClientConfig} from './models/oauth2-client-config.model';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class OAuth2ConfigService implements IOAuth2ClientConfig {
  public responseType = 'token';
  public scope = 'profile openid';
  public clientId: string;
  public apiKeys?: { [urlPattern: string]: string };
  public loginEndpoint: string;
  public logoutEndpoint?: string;
  public userEndpoint?: string;

  get userManagement(): boolean {
    return Boolean(this.userEndpoint);
  }

  get loginUrl(): string {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }

    return this.loginEndpoint
        .concat('?client_id=').concat(this.clientId)
        .concat('&response_type=').concat(this.responseType)
        .concat('&redirect_uri=').concat(encodeURIComponent(window.location.origin)).concat('/oauth2_callback')
        .concat('&scope=').concat(this.scope);
  }

  get logoutUrl(): string | null {
    if (this.logoutEndpoint) {
      return this.logoutEndpoint;
    }
    return null;
  }

  get userInfoUrl(): string | null {
    if (this.userEndpoint) {
      return this.userEndpoint;
    }
    return null;
  }

  constructor( @Inject(PLATFORM_ID) private platformId: any, clientConfig: OAuth2ClientConfig ) {
    if (clientConfig == null || clientConfig.clientId == null || clientConfig.loginEndpoint == null) {
      throw new Error('Client id and/or login endpoint should be defined');
    }

    Object.assign(this, clientConfig);
  }
}
