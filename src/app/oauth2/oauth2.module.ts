import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';

import { app_initializer } from './app_initializer';
import { LockingModalComponent } from './components/locking-modal/locking-modal.component';
import { OAuth2CallbackComponent } from './components/oauth2-callback.component';
import { IOAuth2ClientConfig, OAuth2ClientConfig } from './models/oauth2-client-config.model';
import { applicationRouter } from './oauth2.routes';
import { OAuth2ConnectedGuard } from './services/guards/oauth2-connected.guard';
import { OAuth2VisitorGuard } from './services/guards/oauth2-visitor.guard';
import { OAuth2Interceptor } from './services/interceptors/oauth2.interceptor';
import { OAuth2ConfigService } from './services/oauth2-config.service';
import { OAuth2ConnectionService } from './services/oauth2-connection.service';
import { OAuth2EventFlow } from './services/oauth2-event-flow.service';
import { OAuth2ModalService } from './services/oauth2-modal.service';
import { OAuth2TokenService } from './services/oauth2-token.service';
import { OAuth2UrlService } from './services/oauth2-url.service';
import { OAuth2UserService } from './services/oauth2-user.service';
import { OAuth2Service } from './services/oauth2.service';



@NgModule({
  declarations: [
    OAuth2CallbackComponent,
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
export class OAuth2Module {
  public static forRoot(clientConfig: IOAuth2ClientConfig): ModuleWithProviders {
    return {
      ngModule: OAuth2Module,
      providers: [
        {
          provide: OAuth2ClientConfig,
          useValue: clientConfig
        },
        OAuth2EventFlow,
        OAuth2ConfigService,
        OAuth2UrlService,
        OAuth2ModalService,
        OAuth2ConnectionService,
        OAuth2TokenService,
        OAuth2UserService,
        OAuth2Service,
        OAuth2ConnectedGuard,
        OAuth2VisitorGuard,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: OAuth2Interceptor,
          multi: true,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: app_initializer,
          multi: true,
          deps: [HttpClient, OAuth2ConfigService, OAuth2ClientConfig]
        }
      ]
    };
  }

  constructor(urlService: OAuth2UrlService, connectionService: OAuth2ConnectionService) {
    urlService.checkDataInHash();
  }
}
