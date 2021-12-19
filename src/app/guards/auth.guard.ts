import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Result, User } from '../models/onchat.model';
import { AuthService } from '../services/apis/auth.service';
import { GlobalData } from '../services/global-data.service';
import { Socket } from '../services/socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private socket: Socket,
    private globalData: GlobalData,
  ) { }

  private handle(): boolean | Observable<boolean> {
    if (this.globalData.user) { return true; }

    return this.authService.info().pipe(
      catchError(() => of(false)),
      map(({ data }: Result<User>) => {
        if (data) {
          this.globalData.user = data;
          this.socket.connect();
        }
        return true;
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
