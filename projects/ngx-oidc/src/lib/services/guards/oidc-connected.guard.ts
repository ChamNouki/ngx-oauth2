import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OIDCService } from '../oidc.service';

@Injectable({
  providedIn: 'root'
})
export class OIDCConnectedGuard implements CanActivate {

  constructor(private authService: OIDCService) {
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
