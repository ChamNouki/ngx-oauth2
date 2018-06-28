import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { OIDCConfigService } from '../../services/oidc-config.service';
import { openLoginScreen } from '../../services/openLoginScreen';

@Component({
  selector: 'oidc-locking-modal',
  styleUrls  : ['./locking-modal.component.css'],
  templateUrl: './locking-modal.component.html'
})
export class LockingModalComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: any, private config: OIDCConfigService) {
  }

  public async openLoginScreen(): Promise<void> {
    const url = await this.config.getAuthorizationUrl();
    openLoginScreen(url, this.platformId);
  }
}
