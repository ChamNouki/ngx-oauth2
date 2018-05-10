import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IExtendedWindow } from './models/extended-window.interface';
import { IOAuth2Event } from './models/oauth2-events.interface';
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
    this.eventFlow.flow.subscribe((event: IOAuth2Event) => {
      switch (event.action) {
        case OAuth2Events.LOGGIN_REQUIRED:
          this.login();
          break;
        case OAuth2Events.LOGGOUT_REQUIRED:
          this.logout();
          break;
      }
    });
  }

  public logout() {
    const logoutUrl = this.config.logoutUrl;
    if (isPlatformBrowser(this.platformId) && logoutUrl) {
      window.open(logoutUrl, 'oauth2_logout');
    }
  }

  public login() {
    if (!isPlatformBrowser(this.platformId) || this.isLoginInProgress()) {
      return;
    }

    if (this.tokenService.isNotTooRecent()) {
      throw new Error('Seems to be to much fedid redirection.');
    }

    this.setCallbackFunction();

    this.modalService.open(LockingModalComponent);
    openLoginScreen(this.config.loginUrl, this.platformId);
  }

  private setCallbackFunction() {
    (window as IExtendedWindow).setOauthParams = (callingWindow: Window, tokenMap: Map<string, string>) => {
      if (!tokenMap.has('access_token')) {
        throw new Error(`It seems that the fedid hasn't provided any access_token.`);
      }

      callingWindow.addEventListener('beforeunload', () => {
        this.zone.run(() => {
          this.eventFlow.loggedIn(tokenMap);
        });
      });

      delete (window as IExtendedWindow).setOauthParams;

      this.modalService.dispose();
    };
  }

  private isLoginInProgress(): boolean {
    return isPlatformBrowser(this.platformId) && (window as IExtendedWindow).setOauthParams != null;
  }
}
