import { Component, OnInit, inject, signal } from '@angular/core';
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
  // public users: User[] = [];
  public users = signal<User[]>([]);

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

  ngOnInit(): void {
    this.getUsers();
  }

  isValidField(field: string) {

    return this.validatorsService.validField(this.myForm, field);
  }

  getUsers() {

    return this.usersService.getUsers().subscribe(
      users => {
     // console.log(users);
        this.users.set(users);
     // this.users = users;
      });
  }

  createUser() {

    console.log(this.myForm.value);

    // const form = this.myForm.value as User;

    const user = {

      id: this.myForm.get( "id" )?.value,
      name: this.myForm.get( "name" )?.value,
      password: this.myForm.get( "password1" )?.value,
      email:  this.myForm.get( "email" )?.value,
      check: this.myForm.get( "check" )?.value,
      country: this.myForm.get( "country" )?.value,
      city: this.myForm.get( "city" )?.value,
    }

    if (this.myForm.invalid) {

      this.myForm.markAllAsTouched();
      // TODO: alert "faltan datos"
      return;
    }

    this.usersService.addUser( user ).subscribe();
 // this.usersService.addUser( form ).subscribe();
    //this.getUsers(); // ! xq no funciona antes y sí después?
    this.myForm.reset();
    this.getUsers();
  }

  deleteUser(id: number) {

    this.usersService.eraseUser( id ).subscribe();
    this.getUsers(); // ! porque aqui no funciona?
  }

  editUser( user: User ) {}
}
