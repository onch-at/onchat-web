import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Result } from '../models/interface.model';
import { OnChatService } from '../services/onchat.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private onChatService: OnChatService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Promise<boolean> | Observable<boolean> {
    const isLogin = this.onChatService.isLogin;
    if (isLogin == null) { // 如果还没有被初始化
      return new Observable(observer => {
        this.onChatService.checkLogin().subscribe((result: Result<boolean>) => {
          this.onChatService.isLogin = result.data;
          observer.next(result.data);
          return observer.complete();
        }, () => {
          observer.next(false);
          return observer.complete();
        });
      });
    }
    return isLogin;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLogin = this.onChatService.isLogin;
    if (isLogin == null) { // 如果还没有被初始化
      return new Observable(observer => {
        this.onChatService.checkLogin().subscribe((result: Result<boolean>) => {
          this.onChatService.isLogin = result.data;
          !result.data && this.router.navigate(['/login']); // 返回登录页面
          observer.next(result.data);
          return observer.complete();
        }, () => {
          observer.next(false);
          return observer.complete();
        });
      });
    }

    !isLogin && this.router.navigate(['/login']);
    return isLogin;
  }

}
