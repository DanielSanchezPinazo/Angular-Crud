import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Countries, User } from 'src/app/interfaces/interfaces';

import { UsersService } from 'src/app/services/users-service.service';
import { ValidatorsService } from 'src/app/services/validators/validators.service';

import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { UserDataServiceService } from 'src/app/services/user-data-service.service';

@Component({
  selector: 'app-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent implements OnInit, OnDestroy {

  @ViewChild('selfClosingAlert', { static: false })
  selfClosingAlert: NgbAlert | undefined;

  public countries: string[] = Object.values(Countries);
  // public users = signal<User[]>([]);
  public currentUser?: User;
  private formBuilder = inject( FormBuilder );
  private validatorsService = inject( ValidatorsService );
  private usersService = inject( UsersService );
  private userDataService = inject( UserDataServiceService );
  private unsubscribe$ = new Subject<void>();

  public myForm: FormGroup = this.formBuilder.group({

    name: ["", [ Validators.required , Validators.minLength(3)]],
    password: ["", [Validators.required, Validators.minLength( 3 )] ],
    password2: ["", [Validators.required, Validators.minLength( 3 )]],
    email: ["", [ Validators.required, Validators.email ]],
    check: [ false ],
    country: ["", Validators.required],
    city: ["", Validators.required],
  }, {
    validators: [
      this.validatorsService.equalFields("password", "password2")
    ]
  });

  ngOnInit(): void {

    this.getCurrentUser();
    this.cleanForm();
  };

  ngOnDestroy(): void {

    this.unsuscribe();
  };

  //! no se puede desestrucutrar así
  // public { name, password1: password, email, check, country, city } = this.myForm;

  // constructor(){
  //   this.myForm.valueChanges.subscribe(res =>{
  //     console.log(res);

  //   })
  // }

  public cleanForm() {

    this.usersService.getSuccessMessage$()
      .pipe( takeUntil ( this.unsuscribe()))
      .subscribe( () => this.myForm.reset());
    };

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

    if (this.myForm.invalid) {

      this.myForm.markAllAsTouched();
      return;
    };

    const user = this.getFormUser() as User;

    this.usersService.addUser$(user)
      .pipe(
        switchMap(() => this.usersService.getUsers$( )),
        takeUntil( this.unsuscribe())
      )
      .subscribe(() => {

        this.myForm.reset();
        this.usersService.setSuccessMessage( "USUARIO CREADO" );
      });
  }

  public getCurrentUser() {
    this.userDataService.getCurrentUser$()
      .pipe( takeUntil( this.unsuscribe()))
      .subscribe( result => {

        this.currentUser = result;
        this.myForm.patchValue(this.currentUser!);
      })
  };

  public patchUser() {

    const id: number = this.currentUser!.id;
    const user: User = { id, ...this.getFormUser() };
    // console.log(this.currentUser);
    // console.log(user);
    this.usersService.modUser$( user )
      .pipe(
        switchMap(() => this.usersService.getUsers$( )),
        takeUntil( this.unsuscribe())
      )
      .subscribe( () => {

        this.usersService.setSuccessMessage( "USUARIO EDITADO" );
        this.currentUser = undefined;
        this.myForm.reset();
      });
  }

  public unsuscribe(): Subject<void> {

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    return this.unsubscribe$;
  };
}
