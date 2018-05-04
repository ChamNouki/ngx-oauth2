import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IExtendedWindow } from './models/extended-window.interface';

@Injectable()
export class OAuth2UrlService {

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
  }

  public checkDataInHash() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const fragment = window.location.hash.slice(window.location.hash.lastIndexOf('#') + 1);

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
      // then saving key/value pair
      .forEach((paramsKeyValue: string[]) => {
        tokenMap.set(paramsKeyValue[0], paramsKeyValue[1]);
      });

    return tokenMap;
  }
}
