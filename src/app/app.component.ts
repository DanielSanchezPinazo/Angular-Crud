import { Component, OnInit, WritableSignal, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Countries, User } from './interfaces/interfaces';

import { ValidatorsService } from './services/validators/validators.service';
import { UsersService } from './services/users-service.service';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'crud';

}
