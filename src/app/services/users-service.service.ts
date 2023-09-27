import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environments } from 'src/environment/environment';

import { User } from '../interfaces/interfaces';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject( HttpClient );
  private baseUrl: string = environments.baseUrl;

  public getUsers(): Observable<User[]> {

    return this.http.get<User[]>( `${this.baseUrl}/users` );
  }

  public addUser( user: User ): Observable<User> {

    return this.http.post<User>( `${this.baseUrl}/users`, user );
  }

  public eraseUser( id: number ): Observable<boolean> {

    return this.http.delete( `${this.baseUrl}/users/${ id }` )
    .pipe(
      map( resp => true ),
      catchError( err => of( false ))
    );
  }

  public getUserById( id: number ): Observable<User> {

    return this.http.get<User>( `${this.baseUrl}/users/${ id }` );
  }

  public modUser( user: User ): Observable<User> {

    return this.http.patch<User>( `${this.baseUrl}/users/${ user.id }`, user );
  }

}
