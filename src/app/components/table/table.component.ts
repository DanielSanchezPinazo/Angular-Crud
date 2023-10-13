import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';

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
  public message = "";
  private unsubscribe$ = new Subject<void>();

  @ViewChild("alertMessage", { static: false })
  public alertMessage!: NgbAlert;

  ngOnInit(): void {

    this.getUsers();
    this.updateTable();
    this.showMessage();
  };

  ngOnDestroy(): void {

    this.unsuscribe$();
  };

  public updateTable() {

    this.usersService.getUsersTable$()
      .pipe(
        takeUntil(this.unsuscribe$()),
        // tap(console.log)
      )
      .subscribe( (users: User[]) => {

        this.users = users;
      });
  };

  public showMessage() {

    this.usersService.getSuccessMessage$()
    .pipe( takeUntil( this.unsuscribe$()))
    .subscribe( (message) => {

      this.message = message;
      setTimeout(() => this.alertMessage?.close() , 2000)
    });
  };

  public getUsers()/*: WritableSignal<User[]>*/ { //! porque no se puede asignar ese tipo?

    return this.usersService.getUsers$()
      .pipe( takeUntil( this.unsuscribe$()))
      .subscribe(users => {
      // console.log(users);
      // this.users.set(users);
        this.users = users;
      });
  };
// ! no funciona como computed
  // public getUsers = computed( () => {

  //   this.usersService.getUsers().subscribe(
  //     users => {
  //       this.users.set(users);
  //    return users;
  //     })
  //    } );

  public getUser( id: number ) {

    this.usersService.getUserById$( id )
      .pipe( takeUntil( this.unsuscribe$()))
      .subscribe( user => {
        this.usersService.setCurrentUser( user );
        // console.log( this.usersService.getCurrentUser());
      });
    // console.log(user);
  };

  public deleteUser(id: number): void {

    this.usersService.eraseUser$( id )
      .pipe(

        switchMap(() => this.usersService.getUsers$( )),
        takeUntil( this.unsuscribe$())
      )
      .subscribe( (users: User[]) => {

        this.users = users;
        this.usersService.setSuccessMessage( "USUARIO BORRADO" );
      });
  };

  public closeMessage() {

    this.usersService.setSuccessMessage( "" );
  }

  public unsuscribe$(): Subject<void> {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    return this.unsubscribe$;
  };
}
