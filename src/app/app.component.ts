import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Countries, User } from './interfaces/interfaces';

import { Observable, tap } from 'rxjs';

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

  private formBuilder = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  public myForm: FormGroup = this.formBuilder.group({

    name: ["", Validators.required],
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
    this.usersService.getUsers().subscribe(
      users => {
        console.log(users);
        this.users = users;
      }
    );

    console.log(this.users);
  }

  isValidField(field: string) {

    return this.validatorsService.validField(this.myForm, field);
  }

  onSubmit() {

    console.log(this.myForm.value);

    if (this.myForm.invalid) {

      // console.log(this.myForm);
      this.myForm.markAllAsTouched();
    }

    // this.users.push( this.getFormUser() );

    this.myForm.reset();
  }

  getFormUser() {

    // return {

    //   name: this.myForm.get( "name" )?.value,
    //   password: this.myForm.get( "password" )?.value,
    //   email:  this.myForm.get( "email" )?.value,
    //   check: this.myForm.get( "check" )?.value,
    //   country: this.myForm.get( "country" )?.value,
    //   city: this.myForm.get( "city" )?.value,
    // }
  }

  deleteUser(email: string) {



  }
}
