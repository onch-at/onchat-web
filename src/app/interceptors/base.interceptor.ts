import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Overlay } from '../services/overlay.service';

@Injectable({
  providedIn: 'root'
})
export class BaseInterceptor implements HttpInterceptor {

  constructor(private overlay: Overlay) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status !== 200) {
          this.overlay.presentToast('操作失败，原因：' + error.error.msg || error.statusText);
        }

        return throwError(error);
      })
    );
  }
}
