import { OAuth2EventFlow } from './oauth2-event-flow.service';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, scan, takeWhile, mergeMap } from 'rxjs/operators';

@Injectable()
export class OAuth2HandlerService {
  constructor(private authEventFlow: OAuth2EventFlow) {
  }

  public handle401<T>(attempts: Observable<any>): Observable<T | void> {
    return attempts.pipe(
      switchMap((error: any) => {
        // TODO in the futur need to know if error cames from an API Manager or from the API itself
        if (error.status === 401) {
          return of(error);
        }
        return throwError(error);
      }),
      scan((acc, value) => {
        return acc + 1;
      }, 0),
      takeWhile((acc) => acc < 2),
      mergeMap(() => {
        return this.authEventFlow.requireLogin();
      })
    );
  }
}
