import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Result, User } from '../models/onchat.model';
import { GlobalDataService } from '../services/global-data.service';
import { OnChatService } from '../services/onchat.service';

@Injectable({
  providedIn: 'root'
})
export class NotAuthGuard implements CanActivate, CanLoad {
  constructor(
    private onChatService: OnChatService,
    private globalDataService: GlobalDataService,
    private router: Router
  ) { }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Promise<boolean> | Observable<boolean> {
    if (this.globalDataService.user) { return false; }

    return new Observable(observer => {
      this.onChatService.checkLogin().subscribe((result: Result<boolean | User>) => {
        if (result.data) {
          this.globalDataService.user = result.data as User;
          this.router.navigate(['/']); // 如果登录了就返回主页
        }

        observer.next(!result.data);
        observer.complete();
      }, () => {
        observer.next(false);
        observer.complete();
      });
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.globalDataService.user) { return false; }

    return new Observable(observer => {
      this.onChatService.checkLogin().subscribe((result: Result<boolean | User>) => {
        if (result.data) {
          this.globalDataService.user = result.data as User;
          this.router.navigate(['/']); // 如果登录了就返回主页
        }

        observer.next(!result.data);
        observer.complete();
      }, () => {
        observer.next(false);
        observer.complete();
      });
    });
  }

}
