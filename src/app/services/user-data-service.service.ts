import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserDataServiceService {

  private _users$ = new Subject<User[]>();
  private _currentUser$ = new Subject<User>();

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

}
