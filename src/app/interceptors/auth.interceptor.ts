import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, share, switchMap, tap } from 'rxjs/operators';
import { ResultCode } from '../common/enum';
import { Result } from '../models/onchat.model';
import { AuthService } from '../services/apis/auth.service';
import { AppService } from '../services/app.service';
import { GlobalData } from '../services/global-data.service';
import { SocketService } from '../services/socket.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /** 令牌刷新器 */
  private refresher: Observable<Result<string>>;

  constructor(
    private router: Router,
    private globalData: GlobalData,
    private appService: AppService,
    private authService: AuthService,
    private tokenService: TokenService,
    private socketService: SocketService,
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
          if (this.refresher) {
            return this.waitRefresh(request, next);
          }

          if (refresh) {
            this.refreshToken(refresh);
            return this.waitRefresh(request, next);
          }

          this.signOut();
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
    this.refresher = this.authService.refresh(token).pipe(
      share(),
      tap(({ code, data }: Result<string>) => {
        if (code !== ResultCode.Success) {
          return this.signOut();
        }

        const playload = this.tokenService.parse(data);

        this.tokenService.store(data);
        // 续签成功，重启刷新令牌任务
        this.appService.stopRefreshTokenTask();
        this.appService.startRefreshTokenTask(playload);
      }),
      catchError((error: HttpErrorResponse) => {
        this.signOut();
        return throwError(error);
      }),
      finalize(() => this.refresher = null)
    );
  }

  /**
   * 等待令牌续签后再发送请求
   * @param request
   * @param next
   */
  private waitRefresh(request: HttpRequest<unknown>, next: HttpHandler) {
    return this.refresher.pipe(
      switchMap(({ data }: Result<string>) => {
        request = request.clone({
          headers: request.headers.set('Authorization', data)
        });

        return next.handle(request)
      })
    );
  }

  /**
   * 跳转到登录页
   */
  private signOut() {
    this.globalData.reset();
    this.tokenService.clear();
    this.socketService.disconnect();
    this.router.navigateByUrl('/user/login');
  }

}
