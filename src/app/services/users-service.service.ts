import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environments } from 'src/environment/environment';

import { User } from '../interfaces/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private http = inject( HttpClient );
  private baseUrl: string = environments.baseUrl;
  public userAdded = signal<User | undefined>( undefined );
  public userToUpdate = signal<User | undefined>( undefined );

   getUsers(): Observable<User[]> {

    return this.http.get<User[]>( `${this.baseUrl}/users` );
  }

}
