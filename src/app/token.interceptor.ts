import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // request.headers.append('Auth', 'Bearer ' + sessionStorage.getItem('token'))
    request = request.clone({
      setHeaders:{
        Authorization: 'Bearer '+ sessionStorage.getItem('token')
      }
    });
    return next.handle(request);
  }
}
