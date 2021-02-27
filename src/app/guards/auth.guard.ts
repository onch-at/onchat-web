import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result, User } from '../models/onchat.model';
import { ApiService } from '../services/api.service';
import { GlobalData } from '../services/global-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private apiService: ApiService,
    private globalData: GlobalData,
    private router: Router
  ) { }

  private handle(): boolean | Observable<boolean> {
    if (this.globalData.user) { return true; }

    return this.apiService.checkLogin().pipe(
      map((result: Result<false | User>) => {
        if (result.data) {
          this.globalData.user = result.data;
        } else {
          this.router.navigateByUrl('/user/login');
        }
        return !!result.data;
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
