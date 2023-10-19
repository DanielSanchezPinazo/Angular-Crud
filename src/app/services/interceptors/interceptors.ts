import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class Interceptors implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

// Seteamos los headers que deben tener todas las peticiones HTTP que enviemos

    const addHeaders = req.clone( { headers: req.headers.set( "Content-Type", "application/json" )});

// con el contenido del pipe manejamos los errores de las respuestas que recibimos por cada petición

    return next.handle( addHeaders ).pipe(


    );
  }



}
