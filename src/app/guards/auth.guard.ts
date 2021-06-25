import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result, User } from '../models/onchat.model';
import { UserService } from '../services/apis/user.service';
import { GlobalData } from '../services/global-data.service';
import { SocketService } from '../services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private userService: UserService,
    private socketService: SocketService,
    private globalData: GlobalData,
    private router: Router
  ) { }

  private handle(): boolean | Observable<boolean> {
    if (this.globalData.user) { return true; }

    return this.userService.checkLogin().pipe(
      map(({ data }: Result<false | User>) => {
        if (data) {
          this.globalData.user = data;
          this.socketService.connect();
        } else {
          this.router.navigateByUrl('/user/login');
        }
        return !!data;
      })
    );
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Promise<boolean> | Observable<boolean> {
    return this.handle();
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.handle();
  }

}
