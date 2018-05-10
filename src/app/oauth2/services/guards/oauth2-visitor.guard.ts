import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { OAuth2Service } from '../oauth2.service';

@Injectable()
export class OAuth2VisitorGuard implements CanActivate {
  constructor(private authService: OAuth2Service) {
  }

  public canActivate() {
    return !this.authService.isConnected();
  }
}
