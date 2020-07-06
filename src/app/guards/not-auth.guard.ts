import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Result } from '../models/onchat.model';
import { OnChatService } from '../services/onchat.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate, CanLoad {
  constructor(private onChatService: OnChatService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Promise<boolean> | Observable<boolean> {
    const isLogin = this.onChatService.isLogin;
    if (isLogin !== null) { return !isLogin; }

    return new Observable(observer => {
      this.onChatService.checkLogin().subscribe((result: Result<number>) => {
        this.onChatService.isLogin = Boolean(result.data);
        this.onChatService.userId = result.data || undefined;
        observer.next(!this.onChatService.isLogin);
        return observer.complete();
      }, () => {
        observer.next(false);
        return observer.complete();
      });
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLogin = this.onChatService.isLogin;
    if (isLogin !== null) {
      isLogin && this.router.navigate(['/']);
      return !isLogin;
    }

    return new Observable(observer => {
      this.onChatService.checkLogin().subscribe((result: Result<number>) => {
        this.onChatService.isLogin = Boolean(result.data);
        this.onChatService.userId = result.data || undefined;
        result.data && this.router.navigate(['/']); // 如果已经登录了，就直接跳回首页

        observer.next(!this.onChatService.isLogin);
        return observer.complete();
      }, () => {
        observer.next(false);
        return observer.complete();
      });
    });
  }

}
