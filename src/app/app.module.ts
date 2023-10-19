import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormComponent } from './components/reactive-form/reactive-form.component';
import { TableComponent } from './components/table/table.component';
import { Interceptors } from './services/interceptors/interceptors';

@NgModule({
  declarations: [
    AppComponent,
    ReactiveFormComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptors ,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
