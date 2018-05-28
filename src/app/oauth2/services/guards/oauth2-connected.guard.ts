import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OAuth2Service } from '../oauth2.service';

@Injectable()
export class OAuth2ConnectedGuard implements CanActivate {

  constructor(private authService: OAuth2Service) {
  }

  public canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isConnected()) {
      return true;
    } else {
      return this.authService.login().pipe(
        map(() => {
          return this.authService.isConnected();
        })
      );
    }
  }
}
