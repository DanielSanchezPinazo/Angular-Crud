import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environments } from 'src/environment/environment';

import { User } from '../interfaces/interfaces';
import { Observable, catchError, map, BehaviorSubject, of, Subject, tap, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _http = inject( HttpClient );
  private _baseUrl: string = environments.baseUrl;
  private _users$ = new Subject<User[]>();
  private _currentUser$ = new Subject<User>();
  private _successMessage$ = new BehaviorSubject<string>("");

  public setUsers( users: User[] ): void {

    this._users$.next(users);
  };

  public getUsersTable$(): Observable<User[]> {

    return this._users$.asObservable();
  };

  public setCurrentUser( user: User ): void {

    this._currentUser$.next( user );
  };

  public getCurrentUser$(): Observable<User> {

    return this._currentUser$.asObservable();
  };

  public setSuccessMessage( message: string): void {

    this._successMessage$.next(message);
  };

  public getSuccessMessage$(): Observable<string> {

    return this._successMessage$.asObservable();
  };

  public getUsers$(): Observable<User[]> {

    return this._http.get<User[]>( `${this._baseUrl}/users`).pipe(

      tap( (users: User[]) => this.setUsers(users))
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
