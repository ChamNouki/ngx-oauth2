import { isPlatformBrowser } from '@angular/common';

export function openLoginScreen(url: string, platformId: any) {
  if (isPlatformBrowser(platformId)) {
    window.open(url, 'oauth2_login');
  }
}
