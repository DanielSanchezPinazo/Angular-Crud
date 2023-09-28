import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Countries, User } from 'src/app/interfaces/interfaces';
import { UsersService } from 'src/app/services/users-service.service';
import { ValidatorsService } from 'src/app/services/validators/validators.service';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit, OnDestroy {

  ngOnInit(): void {

    this.editCurrentUser();

  };

  ngOnDestroy(): void {

    this.usersService.unsuscribe();
  };

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

  //! no se puede desestrucutrar así
  // public { name, password1: password, email, check, country, city } = this.myForm;

  // constructor(){
  //   this.myForm.valueChanges.subscribe(res =>{
  //     console.log(res);

  //   })
  // }

  public isValidField(field: string): boolean | null {

    return this.validatorsService.validField(this.myForm, field);
  };

  public getFormUser() {

    const user = {

      name: this.myForm.get("name")?.value,
      password: this.myForm.get("password")?.value,
      email: this.myForm.get("email")?.value,
      check: this.myForm.get("check")?.value,
      country: this.myForm.get("country")?.value,
      city: this.myForm.get("city")?.value,
    }

    return user;
  };

  public createUser(): void {

    const user = this.getFormUser() as User;

    if (this.myForm.invalid) {

      this.myForm.markAllAsTouched();  // TODO: alert "faltan datos"
      return;
    };

    this.usersService.addUser(user)
      .pipe( takeUntil ( this.usersService.unsuscribe()))
      .subscribe(() => {
        this.myForm.reset();
        this.usersService.setUpdateTableSubject(true);
      });
  }

  public editCurrentUser() {
    this.usersService.getCurrentUser()
      .pipe( takeUntil( this.usersService.unsuscribe()))
      // .pipe( filter( user => user.id ))
      .subscribe(result => {
        this.currentUser = result;
        this.myForm.patchValue(this.currentUser!);
      })
  };

  public patchUser() {

    const id: number = this.currentUser!.id;
    const user: User = { id, ...this.getFormUser() };
    console.log(this.currentUser);
    console.log(user);
    this.usersService.modUser( user )
      .pipe( takeUntil( this.usersService.unsuscribe()))
      .subscribe( () => {

        this.usersService.setUpdateTableSubject(true);
        this.currentUser = undefined;
        this.myForm.reset();
      });
  }
}
