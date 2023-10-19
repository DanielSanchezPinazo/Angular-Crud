import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { inject } from '@angular/core';
import { UsersService } from '../users-service.service';

@Injectable()
export class Interceptors implements HttpInterceptor {

  private usersService = inject( UsersService );

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

// Seteamos los headers que deben tener todas las peticiones HTTP que enviemos

    const addHeaders = req.clone( { headers: req.headers.set( "Content-Type", "application/json" )});

// con el contenido del pipe manejamos los errores de las respuestas que recibimos por cada petición

    return next.handle( addHeaders ).pipe(

      catchError( err => {

        if( err instanceof HttpErrorResponse ) {

          console.log("Error de interceptor");
          this.usersService.setSuccessMessage( "Algo ha fallado, intentelo mas tarde" );
        }

        throw err;
       } )
    );
  }



}
