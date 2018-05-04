import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { OAuth2Service } from '../oauth2.service';
import { OAuth2EventFlow } from '../oauth2-event-flow.service';

@Injectable()
export class OAuth2ConnectedGuard implements CanActivate {

  constructor(private authService: OAuth2Service, private eventFlow: OAuth2EventFlow) {
  }

  public canActivate(request: any): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isConnected()) {
      return true;
    } else {
      return this.eventFlow.requireLogin()
        .flatMap(() => Observable.of(this.authService.isConnected()));
    }
  }
}
