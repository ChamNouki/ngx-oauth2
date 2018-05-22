import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IExtendedWindow } from './models/extended-window.interface';
import { OAuth2Event } from './models/oauth2-events.interface';
import { OAuth2Events } from './models/oauth2-events.enum';
import { OAuth2TokenService } from './oauth2-token.service';
import { OAuth2ModalService } from './oauth2-modal.service';
import { OAuth2EventFlow } from './oauth2-event-flow.service';
import { OAuth2ConfigService } from './oauth2-config.service';
import { LockingModalComponent } from '../components/locking-modal/locking-modal.component';
import { openLoginScreen } from './openLoginScreen';

@Injectable()
export class OAuth2ConnectionService {

  constructor(@Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone,
    private config: OAuth2ConfigService,
    private eventFlow: OAuth2EventFlow,
    private modalService: OAuth2ModalService,
    private tokenService: OAuth2TokenService) {
    this.eventFlow.flow.subscribe((event: OAuth2Event) => {
      switch (event.action) {
        case OAuth2Events.AUTHENTICATION_REQUIRED:
          this.authenticate();
          break;
        case OAuth2Events.SESSION_END_REQUIRED:
          this.endSession();
          break;
      }
    });
  }

  public endSession() {
    const logoutUrl = this.config.endSessionUrl;
    if (isPlatformBrowser(this.platformId) && logoutUrl) {
      window.open(logoutUrl, 'oauth2_logout');
    }
  }

  public async authenticate() {
    if (!isPlatformBrowser(this.platformId) || this.isAuthenticationInProgress()) {
      return;
    }

    if (this.tokenService.isNotTooRecent()) {
      throw new Error('Seems to be to much fedid redirection.');
    }

    this.setCallbackFunction();

    this.modalService.open(LockingModalComponent);

    const url = await this.config.getAuthorizationUrl();
    openLoginScreen(url, this.platformId);
  }

  private setCallbackFunction() {
    (window as IExtendedWindow).setOauthParams = (callingWindow: Window, callbackParams: Map<string, string>) => {
      if (!callbackParams.has('access_token')) {
        throw new Error(`It seems that the fedid hasn't provided any access_token.`);
      }

      callingWindow.addEventListener('beforeunload', () => {
        this.zone.run(() => {
          this.eventFlow.authenticated(callbackParams);
        });
      });

      delete (window as IExtendedWindow).setOauthParams;

      this.modalService.dispose();
    };
  }

  private isAuthenticationInProgress(): boolean {
    return isPlatformBrowser(this.platformId) && (window as IExtendedWindow).setOauthParams != null;
  }
}
