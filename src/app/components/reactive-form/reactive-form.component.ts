import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { Countries, User } from 'src/app/interfaces/interfaces';
import { UsersService } from 'src/app/services/users-service.service';
import { ValidatorsService } from 'src/app/services/validators/validators.service';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent {

  public countries: string[] = Object.values(Countries);
  // public users = signal<User[]>([]);
  public currentUser?: User;
  private formBuilder = inject(FormBuilder);
  private validatorsService = inject(ValidatorsService);

  private usersService = inject(UsersService);

  public myForm: FormGroup = this.formBuilder.group({

    name: ["", Validators.required],  // TODO: más validaciones
    password: ["", Validators.required],
    password2: ["", Validators.required],
    email: ["", Validators.required],
    check: [""],
    country: ["", Validators.required],
    city: ["", Validators.required],
  }, {
    validators: [
      this.validatorsService.equalFields("password", "password2")
    ]
  });

  public name = this.myForm.get( "name" )?.value;
  //! no se puede desestrucutrar así
  // public { name, password1: password, email, check, country, city } = this.myForm;

  // constructor(){
  //   this.myForm.valueChanges.subscribe(res =>{
  //     console.log(res);

  //   })
  // }

  isValidField(field: string): boolean | null {

    return this.validatorsService.validField(this.myForm, field);
  }

  getFormUser() {

    const user = {

      id: this.myForm.get( "id" )?.value,
      name: this.myForm.get( "name" )?.value,
      password: this.myForm.get( "password" )?.value,
      email:  this.myForm.get( "email" )?.value,
      check: this.myForm.get( "check" )?.value,
      country: this.myForm.get( "country" )?.value,
      city: this.myForm.get( "city" )?.value,
    }

    return user;
  }


  public createUser(): void {

    const user: User = this.getFormUser();

    if (this.myForm.invalid) {

      this.myForm.markAllAsTouched();
      // TODO: alert "faltan datos"
      return;
    }

    this.usersService.addUser( user ).subscribe( () => {
      this.myForm.reset();
    //!  this.getUsers();
    } );

  }

 // TODO: unsuscribe

 patchUser() {

  // const user: User = this.getFormUser();

  console.log(this.currentUser );

  // this.usersService.modUser( user ).subscribe( user => this.currentUser = user );
  // console.log(user);
  // this.getUsers();

}
}
