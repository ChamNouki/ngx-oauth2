import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { applicationRouter } from './OAuth2.routes';
import { OAuth2CallbackComponent } from './components/OAuth2-callback.component';
import { LockingModalComponent } from './components/locking-modal/locking-modal.component';
import { IOAuth2ClientConfig, OAuth2ClientConfig } from './services/models/oauth2-client-config.model';
import { OAuth2EventFlow } from './services/oauth2-event-flow.service';
import { OAuth2ConfigService } from './services/oauth2-config.service';
import { OAuth2UrlService } from './services/oauth2-url.service';
import { OAuth2ModalService } from './services/oauth2-modal.service';
import { OAuth2HandlerService } from './services/oauth2-handler.service';
import { OAuth2ConnectionService } from './services/oauth2-connection.service';
import { OAuth2TokenService } from './services/oauth2-token.service';
import { OAuth2UserService } from './services/oauth2-user.service';
import { OAuth2Service } from './services/oauth2.service';
import { OAuth2ConnectedGuard } from './services/guards/oauth2-connected.guard';
import { OAuth2VisitorGuard } from './services/guards/oauth2-visitor.guard';

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
        { provide: OAuth2ClientConfig, useValue: clientConfig },
        OAuth2EventFlow,
        OAuth2ConfigService,
        OAuth2UrlService,
        OAuth2ModalService,
        OAuth2HandlerService,
        OAuth2ConnectionService,
        OAuth2TokenService,
        OAuth2UserService,
        OAuth2Service,
        OAuth2ConnectedGuard,
        OAuth2VisitorGuard
      ]
    };
  }

  constructor(urlService: OAuth2UrlService, connectionService: OAuth2ConnectionService) {
    urlService.checkDataInHash();
  }
}
