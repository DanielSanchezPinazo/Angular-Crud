import { Component, OnInit, WritableSignal, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Countries, User } from './interfaces/interfaces';

import { ValidatorsService } from './services/validators/validators.service';
import { UsersService } from './services/users-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'crud';

  public countries: string[] = Object.values(Countries);
  private usersService = inject(UsersService);
  public users: User[] = [];
  // public users = signal<User[]>([]);
  public currentUser?: User;

  private formBuilder = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  public myForm: FormGroup = this.formBuilder.group({

    name: ["", Validators.required],  // TODO: más validaciones
    password1: ["", Validators.required],
    password2: ["", Validators.required],
    email: ["", Validators.required],
    check: [""],
    country: ["", Validators.required],
    city: ["", Validators.required],
  }, {
    validators: [
      this.validatorsService.equalFields("password1", "password2")
    ]
  });

  public name = this.myForm.get( "name" )?.value;
  //! no se puede desestrucutrar así
  // public { name, password1: password, email, check, country, city } = this.myForm;

  ngOnInit(): void {
    this.getUsers();
  }

  isValidField(field: string): boolean | null {

    return this.validatorsService.validField(this.myForm, field);
  }

  getFormUser() {

    const user = {

      id: this.myForm.get( "id" )?.value,
      name: this.myForm.get( "name" )?.value,
      password: this.myForm.get( "password1" )?.value,
      email:  this.myForm.get( "email" )?.value,
      check: this.myForm.get( "check" )?.value,
      country: this.myForm.get( "country" )?.value,
      city: this.myForm.get( "city" )?.value,
    }

    return user;
  }

  getUsers()/*: WritableSignal<User[]>*/ { //! porque no se puede asignar ese tipo?

    return this.usersService.getUsers().subscribe(
      users => {
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

  public createUser(): void {

    const user: User = this.getFormUser();

    if (this.myForm.invalid) {

      this.myForm.markAllAsTouched();
      // TODO: alert "faltan datos"
      return;
    }

    this.usersService.addUser( user ).subscribe();
    //this.getUsers(); // ! xq no funciona antes y sí después?
    this.myForm.reset();
    this.getUsers();
  }

  deleteUser(id: number): void {

    this.usersService.eraseUser( id ).subscribe();
    this.getUsers(); // ! porque aquí funciona una vez sí una vez no
  }

  getUser( user: User ) {
    // console.log(user);
    this.usersService.getUserById( user ).subscribe( user => this.currentUser = user);
    // console.log(user);
// ! Por qué nada de esto funciona?
    /*if ( user.check ) {
       const check = document.getElementById("check")!.checked = true;
       const checkbox = document.getElementById("check")!.setAttribute( "checked", "true" );
    }*/
  }

  patchUser() {

    console.log(this.currentUser);

    const user = this.getFormUser();

    console.log(user);

    this.usersService.modUser( user ).subscribe( user => this.currentUser = user );
    console.log(user);
    this.getUsers();

  }
}
