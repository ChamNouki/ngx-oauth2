import { Component } from '@angular/core';
import { OIDCUrlService } from '../services/oidc-url.service';

@Component({
  selector: 'oidc-callback-cmp',
  template: ''
})
export class OIDCCallbackComponent {
  constructor(urlService: OIDCUrlService) {
    urlService.checkDataInHash();
  }
}
