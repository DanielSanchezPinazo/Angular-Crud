import { Component, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { User } from 'src/app/interfaces/interfaces';
import { UsersService } from 'src/app/services/users-service.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  private usersService = inject(UsersService);
  public users: User[] = [];
  public currentUser?: User;

  ngOnInit(): void {
    this.getUsers();
  }


  getUsers()/*: WritableSignal<User[]>*/ { //! porque no se puede asignar ese tipo?

    return this.usersService.getUsers().subscribe(users => {
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

    this.usersService.getUserById( id ).subscribe( user => {
      this.currentUser = user;
   //!   this.myForm.patchValue( this.currentUser );
      console.log( this.currentUser );
    });

    // console.log(user);
  }

  deleteUser(id: number): void {

    this.usersService.eraseUser( id ).pipe(
      switchMap(() => this.usersService.getUsers( ))
    ).subscribe((users: User[])=> {
      this.users = users;
    });
  }

   // TODO: unsuscribe


}
