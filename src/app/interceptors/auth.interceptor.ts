import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { Result } from '../models/onchat.model';
import { AuthService } from '../services/apis/auth.service';
import { GlobalData } from '../services/global-data.service';
import { SocketService } from '../services/socket.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /** 刷新令牌中 */
  private refreshing: boolean = false;
  private refresher: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private socketService: SocketService,
    private globalData: GlobalData,
    private router: Router,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { access, refresh } = this.tokenService.folder;

    if (access) {
      request = request.clone({
        headers: request.headers.set('Authorization', access)
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) { // 401 Unauthorized
          if (this.refreshing) {
            return this.waitRefresh(request, next);
          }

          if (refresh) {
            this.refreshToken(refresh);
            return this.waitRefresh(request, next);
          }

          this.redirect();
        }

        return throwError(error);
      })
    );
  }

  /**
   * 续签访问令牌
   * @param token 续签令牌
   */
  private refreshToken(token: string) {
    this.refreshing = true;
    this.refresher.next(null);

    this.authService.refresh(token).subscribe(({ data }: Result<string>) => {
      this.refresher.next(data);
      this.tokenService.store(data);
    }, () => {
      this.redirect();
    }, () => {
      this.refreshing = false;
    });
  }

  /**
   * 等待令牌续签后再发送请求
   * @param request
   * @param next
   */
  private waitRefresh(request: HttpRequest<unknown>, next: HttpHandler) {
    return this.refresher.pipe(
      filter(o => o !== null),
      switchMap(o => {
        request = request.clone({
          headers: request.headers.set('Authorization', o)
        });

        return next.handle(request)
      })
    );
  }

  /**
   * 跳转到登录页
   */
  private redirect() {
    this.globalData.reset();
    this.tokenService.clear();
    this.socketService.disconnect();
    this.router.navigateByUrl('/user/login');
  }

}
