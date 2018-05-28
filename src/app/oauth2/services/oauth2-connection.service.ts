import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { LockingModalComponent } from '../components/locking-modal/locking-modal.component';
import { IExtendedWindow } from '../models/extended-window.interface';
import { OAuth2Events } from '../models/oauth2-events.enum';
import { OAuth2Event } from '../models/oauth2-events.interface';
import { OAuth2ConfigService } from './oauth2-config.service';
import { OAuth2EventFlow } from './oauth2-event-flow.service';
import { OAuth2ModalService } from './oauth2-modal.service';
import { OAuth2TokenService } from './oauth2-token.service';
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
    const logoutUrl = this.config.end_session_endpoint;
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
      // check data
      try {
        this.validateCallbackParams(callbackParams);
      } catch (e) {
        this.zone.run(() => {
          this.eventFlow.failedToAuthenticate(e);
        });
      }

      callingWindow.addEventListener('beforeunload', () => {
        this.zone.run(() => {
          this.eventFlow.authenticationDataReceived(callbackParams);
        });
      });

      delete (window as IExtendedWindow).setOauthParams;

      this.modalService.dispose();
    };
  }

  private isAuthenticationInProgress(): boolean {
    return isPlatformBrowser(this.platformId) && (window as IExtendedWindow).setOauthParams != null;
  }

  private async validateCallbackParams(params: Map<string, string>) {
    if (params.has('error')) {
      let errorMessage = params.get('error');

      if (params.has('error_description')) {
        errorMessage = `${errorMessage}: ${params.get('error_description')}`;
      }

      if (params.has('error_uri')) {
        errorMessage = `${errorMessage} [${params.get('error_uri')}]`;
      }

      throw new Error(errorMessage);
    }

    if (!params.has('access_token')) {
      throw new Error('It seems that the SSO has not provided any access_token');
    }

    if (!params.has('id_token')) {
      throw new Error('It seems that the SSO has not provided any id_token');
    }
  }
}

