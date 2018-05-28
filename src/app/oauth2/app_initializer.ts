import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IOAuth2ClientConfig } from './models/oauth2-client-config.model';
import { OpenIdMetadata } from './models/openId-metadata';
import { OAuth2ConfigService } from './services/oauth2-config.service';

export function app_initializer(http: HttpClient, config: OAuth2ConfigService, clientConfig: IOAuth2ClientConfig): () => Promise<any> {
  return (): Promise<any> => {
    return http.get<OpenIdMetadata>(clientConfig.endpoints_discovery).pipe(map(metadata => {
      config.configure(metadata, clientConfig);
      if (config.authorization_endpoint == null) {
        throw new Error('No authorization endpoint found. Can\'t realize authentication.');
      }
    })).toPromise();
  };
}
