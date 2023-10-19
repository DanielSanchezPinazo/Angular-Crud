import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environments } from 'src/environment/environment';

import { User } from '../interfaces/interfaces';
import { Observable, catchError, map, BehaviorSubject, of, tap } from 'rxjs';
import { UserDataServiceService } from './user-data-service.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _http = inject( HttpClient );
  private userDataService = inject( UserDataServiceService );
  private _baseUrl: string = environments.baseUrl;
  private _successMessage$ = new BehaviorSubject<string>("");

  public setSuccessMessage( message: string): void {

    this._successMessage$.next(message);
  };

  public getSuccessMessage$(): Observable<string> {

    return this._successMessage$.asObservable();
  };

  public getUsers$(): Observable<User[]> {

    return this._http.get<User[]>( `${this._baseUrl}/users`).pipe(

      tap( (users: User[]) => this.userDataService.setUsers(users))
    );
  };

  public addUser$( user: User ): Observable<User> {

    return this._http.post<User>( `${this._baseUrl}/users`, user )
  };

  public eraseUser$( id: number ): Observable<boolean> {

    return this._http.delete( `${this._baseUrl}/users/${ id }` )
    .pipe(
      map( resp => true ),
      catchError( err => of( false ))
    );
  };

  public getUserById$( id: number ): Observable<User> {

    return this._http.get<User>( `${this._baseUrl}/users/${ id }` );
  };

  public modUser$( user: User ): Observable<User> {

    return this._http.patch<User>( `${this._baseUrl}/users/${ user.id }`, user );
  };
}
