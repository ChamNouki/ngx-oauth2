import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Hero } from '../models/hero';

@Injectable()
export class HeroService {
  private heroesUrl = 'api/heroes';

  constructor(private http: HttpClient) { }

  getHeroes() {
    return this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(catchError(this.handleError));
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.get<Hero>(url);
  }

  save(hero: Hero) {
    if (hero.id) {
      return this.put(hero);
    }
    return this.post(hero);
  }

  delete(hero: Hero) {
    const url = `${this.heroesUrl}/${hero.id}`;

    return this.http.delete<Hero>(url).pipe(catchError(this.handleError));
  }

  private post(hero: Hero) {
    return this.http
      .post<Hero>(this.heroesUrl, hero)
      .pipe(catchError(this.handleError));
  }

  private put(hero: Hero) {
    const url = `${this.heroesUrl}/${hero.id}`;

    return this.http
      .put<Hero>(url, hero)
      .pipe(catchError(this.handleError));
  }

  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return observableThrowError(res.error || 'Server error');
  }
}
