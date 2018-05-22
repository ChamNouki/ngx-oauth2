import { IOAuth2ClientConfig, OAuth2ClientConfig } from './models/oauth2-client-config.model';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class OAuth2ConfigService implements IOAuth2ClientConfig {
  public scope = 'openid profile';
  public responseType = 'id_token token';
  public clientId: string;
  public authorizationEndpoint: string;
  public endSessionEndpoint?: string;
  public userInfoEndpoint?: string;

  public apiKeys?: { [urlPattern: string]: string };

  private nonce: string;

  get userManagement(): boolean {
    return Boolean(this.userInfoEndpoint);
  }

  get endSessionUrl(): string | null {
    if (this.endSessionEndpoint) {
      return this.endSessionEndpoint;
    }
    return null;
  }

  get userInfoUrl(): string | null {
    if (this.userInfoEndpoint) {
      return this.userInfoEndpoint;
    }
    return null;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: any, clientConfig: OAuth2ClientConfig) {
    if (clientConfig == null || clientConfig.clientId == null || clientConfig.authorizationEndpoint == null) {
      throw new Error('Client id and authorization endpoint should be defined');
    }

    Object.assign(this, clientConfig);
  }

  public async getAuthorizationUrl(): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Not on browser platform.');
    }

    const nonce = this.getNonce(32);
    const redirectUri = encodeURIComponent(window.location.origin);

    return `${this.authorizationEndpoint}?client_id=${this.clientId}&scope=${this.scope}&response_type=${this.responseType}\
&nonce=${nonce}&redirect_uri=${redirectUri}/oauth2_callback`;
  }

  private getNonce(length): string {
      const bytes = new Uint8Array(length);
      const random = window.crypto.getRandomValues(bytes) as Uint8Array;
      const result = [];
      const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
      random.forEach(function (c) {
        result.push(charset[c % charset.length]);
      });
      return result.join('');
  }
}
