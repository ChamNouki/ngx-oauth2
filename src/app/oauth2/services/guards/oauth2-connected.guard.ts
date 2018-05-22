import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, Observer, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
      return this.eventFlow.requireAuthentication().pipe(
        mergeMap(() => of(this.authService.isConnected()))
      );
    }
  }
}
