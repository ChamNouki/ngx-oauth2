import {OAuth2EventFlow} from './oauth2-event-flow.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OAuth2HandlerService {
  constructor(private authEventFlow: OAuth2EventFlow) {
  }

  public handle401<T>(attempts: Observable<any>): Observable<T|void> {
    return attempts
        .switchMap((error: any) => {
          // TODO in the futur need to know if error cames from gravitee or from the API
          if ( error.status === 401 ) {
            return Observable.of(error);
          }
          return Observable.throw(error);
        })
        .scan((acc, value) => {
          return acc + 1;
        }, 0)
        .takeWhile((acc) => acc < 2)
        .flatMap(() => {
          return this.authEventFlow.requireLogin();
        });
  }
}
