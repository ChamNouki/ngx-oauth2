import { InjectionToken } from '@angular/core';
import { OpenIdMetadata } from './openId-metadata';

export interface IOAuth2ClientConfig extends OpenIdMetadata {
  client_id: string;
  endpoints_discovery: string;

  api_keys?: {[urlPattern: string]: string};
}

export const OAuth2ClientConfig = new InjectionToken<IOAuth2ClientConfig>('OAuth2ClientConfig');
