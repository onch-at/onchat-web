import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Result } from '../models/result.model';
import { OnChatService } from '../services/onchat.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate, CanLoad {
  constructor(private onChatService: OnChatService, private router: Router) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Promise<boolean> | Observable<boolean> {
    return new Observable(observer => {
      this.onChatService.checkLogin().subscribe((result: Result<boolean>) => {
        observer.next(!result.data);
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
    return new Observable(observer => {
      this.onChatService.checkLogin().subscribe((result: Result<boolean>) => {
        result.data && this.router.navigate(['/']); // 如果已经登录了，就直接跳回首页

        observer.next(!result.data);
        return observer.complete();
      }, () => {
        observer.next(false);
        return observer.complete();
      });
    });
  }

}
