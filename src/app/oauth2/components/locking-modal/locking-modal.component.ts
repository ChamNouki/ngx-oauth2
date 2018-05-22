import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { OAuth2ConfigService } from '../../services/oauth2-config.service';
import { openLoginScreen } from '../../services/openLoginScreen';

@Component({
  selector: 'oauth2-locking-modal',
  styleUrls  : ['./locking-modal.component.css'],
  templateUrl: './locking-modal.component.html'
})
export class LockingModalComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: any, private config: OAuth2ConfigService) {
  }

  public async openLoginScreen(): Promise<void> {
    const url = await this.config.getAuthorizationUrl();
    openLoginScreen(url, this.platformId);
  }
}
