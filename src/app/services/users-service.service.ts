import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environments } from 'src/environment/environment';

import { User } from '../interfaces/interfaces';
import { Observable, catchError, map, BehaviorSubject, of, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject( HttpClient );
  private baseUrl: string = environments.baseUrl;
  private updateTable$ = new BehaviorSubject<boolean>(true);// TODO: quitar esta variable del servicio
  private currentUser$ = new Subject<User>();
  private successMessage$ = new BehaviorSubject<string>("");

  public setUpdateTable$( value: boolean ): void {

    this.updateTable$.next(value);
  };

  public getUpdateTable$(): Observable<boolean> {

    return this.updateTable$.asObservable();
  };

  public setCurrentUser$( user: User ): void {

    this.currentUser$.next( user );
  };

  public getCurrentUser$(): Observable<User> {

    return this.currentUser$.asObservable();
  };

  public setSuccessMessage$( message: string): void {

    this.successMessage$.next(message);
  };

  public getSuccessMessage$(): Observable<string> {

    return this.successMessage$.asObservable();
  };

  public getUsers$(): Observable<User[]> {

    return this.http.get<User[]>( `${this.baseUrl}/users`)
      // .pipe(
      //   tap( () => this.setUpdateTable$(false))
      // )
  };

  public addUser$( user: User ): Observable<User> {

    return this.http.post<User>( `${this.baseUrl}/users`, user );
  };

  public eraseUser$( id: number ): Observable<boolean> {

    return this.http.delete( `${this.baseUrl}/users/${ id }` )
    .pipe(
      map( resp => true ),
      catchError( err => of( false ))
    );
  };

  public getUserById$( id: number ): Observable<User> {

    return this.http.get<User>( `${this.baseUrl}/users/${ id }` );
  };

  public modUser$( user: User ): Observable<User> {

    return this.http.patch<User>( `${this.baseUrl}/users/${ user.id }`, user );
  };
}
