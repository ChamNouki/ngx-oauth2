import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { IOAuth2ClientConfig, OAuth2ClientConfig } from '../models/oauth2-client-config.model';
import { OpenIdMetadata } from '../models/openId-metadata';

@Injectable()
export class OAuth2ConfigService implements IOAuth2ClientConfig {
  public scope = 'openid profile';
  public response_type = 'id_token token';
  public nonce: string;

  public client_id: string;
  public endpoints_discovery: string;
  public api_keys?: { [urlPattern: string]: string };

  public authorization_endpoint?: string;
  public token_endpoint?: string;
  public userinfo_endpoint?: string;
  public registration_endpoint?: string;
  public introspection_endpoint?: string;
  public revocation_endpoint?: string;
  public end_session_endpoint?: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(OAuth2ClientConfig) clientConfig: IOAuth2ClientConfig
  ) {
    const isNotCorrectlyConfigured = clientConfig == null || clientConfig.client_id == null
      || (clientConfig.endpoints_discovery == null && clientConfig.authorization_endpoint == null);
    if (isNotCorrectlyConfigured) {
      throw new Error('Client id and discovery or authorization endpoint should be defined in module configuration');
    }
  }

  public configure(metadata: OpenIdMetadata, clientConfig: IOAuth2ClientConfig) {
    Object.assign(this, metadata, clientConfig);
  }

  public async getAuthorizationUrl(): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Not on browser platform.');
    }

    this.nonce = this.getNonce(32);
    const redirectUri = encodeURIComponent(window.location.origin);

    return `${this.authorization_endpoint}?client_id=${this.client_id}&scope=${this.scope}&response_type=${this.response_type}\
&nonce=${this.nonce}&redirect_uri=${redirectUri}/oauth2_callback`;
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
