import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IExtendedWindow } from '../models/extended-window.interface';

@Injectable()
export class OAuth2UrlService {

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
  }

  public checkDataInHash() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const fragment = window.location.hash.substring(1);

    if (fragment.length > 0) {
      (window.opener as IExtendedWindow).setOauthParams(window, this.parseFragment(fragment));
      window.close();
    }
  }

  private parseFragment(fragment: string): Map<string, string> {
    const tokenMap: Map<string, string> = new Map();

    // split hash on '&'
    fragment.split('&')
      // then split each key=params on '='
      .map((params: string) => params.split('='))
      // then saving decoded key/value pair
      .forEach(([key, value]) => {
        key = decodeURIComponent(key);
        value = decodeURIComponent(value);
        tokenMap.set(key, value);
      });

    return tokenMap;
  }
}
