import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  /** 刷新令牌中 */
  private refreshing: boolean = false;

  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { access } = this.tokenService.get();

    if (access) {
      request = request.clone({
        headers: request.headers.set('Authorization', access)
      });
    }

    return next.handle(request);
  }
}
