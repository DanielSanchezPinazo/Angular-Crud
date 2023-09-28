import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { switchMap, takeUntil } from 'rxjs';
import { User } from 'src/app/interfaces/interfaces';
import { UsersService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {

  private usersService = inject(UsersService);
  public users: User[] = [];


  ngOnInit(): void {

    this.usersService.getUpdateTableSubject()
      .pipe( takeUntil( this.usersService.unsuscribe()))
      .subscribe( (result) => {
        if (result) {

          this.getUsers();
          this.usersService.setUpdateTableSubject(!result);
        }
      });
  };

  ngOnDestroy(): void {

    this.usersService.unsuscribe();
  };


  getUsers()/*: WritableSignal<User[]>*/ { //! porque no se puede asignar ese tipo?

    return this.usersService.getUsers()
      .pipe( takeUntil( this.usersService.unsuscribe()))
      .subscribe(users => {
      // console.log(users);
      // this.users.set(users);
        this.users = users;
      });
  }
// ! no funciona como computed
  // public getUsers = computed( () => {

  //   this.usersService.getUsers().subscribe(
  //     users => {
  //       this.users.set(users);
  //    return users;
  //     })
  //    } );

  getUser( id: number ) {

    this.usersService.getUserById( id )
      .pipe( takeUntil( this.usersService.unsuscribe()))
      .subscribe( user => {
        this.usersService.setCurrentUser( user );
        // console.log( this.usersService.getCurrentUser());
      });
    // console.log(user);
  }

  deleteUser(id: number): void {

    this.usersService.eraseUser( id )
      .pipe( switchMap(() => this.usersService.getUsers( )))
      .pipe( takeUntil( this.usersService.unsuscribe()))
      .subscribe((users: User[])=> {
        this.users = users;
      });
  }
}
