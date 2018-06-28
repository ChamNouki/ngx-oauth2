import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { app_initializer } from './app_initializer';
import { LockingModalComponent } from './components/locking-modal/locking-modal.component';
import { OIDCCallbackComponent } from './components/oidc-callback.component';
import { IOIDCClientConfig, OIDCClientConfig } from './models/oidc-client-config.model';
import { applicationRouter } from './ngx-oidc.routes';
import { OIDCConnectedGuard } from './services/guards/oidc-connected.guard';
import { OIDCVisitorGuard } from './services/guards/oidc-visitor.guard';
import { OIDCInterceptor } from './services/interceptors/oidc.interceptor';
import { OIDCConfigService } from './services/oidc-config.service';
import { OIDCConnectionService } from './services/oidc-connection.service';
import { OIDCEventFlow } from './services/oidc-event-flow.service';
import { OIDCModalService } from './services/oidc-modal.service';
import { OIDCTokenService } from './services/oidc-token.service';
import { OIDCUrlService } from './services/oidc-url.service';
import { OIDCUserService } from './services/oidc-user.service';
import { OIDCService } from './services/oidc.service';



@NgModule({
  declarations: [
    OIDCCallbackComponent,
    LockingModalComponent
  ],
  entryComponents: [
    LockingModalComponent
  ],
  exports: [
    LockingModalComponent
  ],
  imports: [
    applicationRouter
  ],
  providers: []
})
export class NgxOidcModule {
  public static forRoot(clientConfig: IOIDCClientConfig): ModuleWithProviders {
    return {
      ngModule: NgxOidcModule,
      providers: [
        {
          provide: OIDCClientConfig,
          useValue: clientConfig
        },
        OIDCEventFlow,
        OIDCConfigService,
        OIDCUrlService,
        OIDCModalService,
        OIDCConnectionService,
        OIDCTokenService,
        OIDCUserService,
        OIDCService,
        OIDCConnectedGuard,
        OIDCVisitorGuard,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: OIDCInterceptor,
          multi: true,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: app_initializer,
          multi: true,
          deps: [HttpClient, OIDCConfigService, OIDCClientConfig]
        }
      ]
    };
  }

  constructor(urlService: OIDCUrlService, connectionService: OIDCConnectionService) {
    urlService.checkDataInHash();
  }
}
