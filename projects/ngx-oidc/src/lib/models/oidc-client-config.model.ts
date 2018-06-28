import { InjectionToken } from '@angular/core';
import { OpenIdMetadata } from './openId-metadata';

export interface IOIDCClientConfig extends OpenIdMetadata {
  client_id: string;
  endpoints_discovery: string;

  api_keys?: {[urlPattern: string]: string};
}

export const OIDCClientConfig = new InjectionToken<IOIDCClientConfig>('OIDCClientConfig');
