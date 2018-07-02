import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { IOIDCClientConfig } from './models/oidc-client-config.model';
import { OpenIdMetadata } from './models/openId-metadata';
import { OIDCConfigService } from './services/oidc-config.service';

export function getOIDCConfig(http: HttpClient, config: OIDCConfigService, clientConfig: IOIDCClientConfig): () => Promise<any> {
  return (): Promise<any> => {
    return http.get<OpenIdMetadata>(clientConfig.endpoints_discovery).pipe(map(metadata => {
      config.configure(metadata, clientConfig);
      if (config.authorization_endpoint == null) {
        throw new Error('No authorization endpoint found. Can\'t realize authentication.');
      }
    })).toPromise();
  };
}
