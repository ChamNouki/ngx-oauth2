import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { OIDCService } from '../oidc.service';

@Injectable({
  providedIn: 'root'
})
export class OIDCVisitorGuard implements CanActivate {
  constructor(private authService: OIDCService) {
  }

  public canActivate() {
    return !this.authService.isConnected();
  }
}
