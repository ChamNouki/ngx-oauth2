import { Component } from '@angular/core';
import { OAuth2UrlService } from '../services/oauth2-url.service';

@Component({
  selector: 'oauth2-callback-cmp',
  template: ''
})
export class OAuth2CallbackComponent {
  constructor(urlService: OAuth2UrlService) {
    urlService.checkDataInHash();
  }
}
