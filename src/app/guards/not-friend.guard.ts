import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Result } from '../models/onchat.model';
import { ApiService } from '../services/api.service';
import { GlobalData } from '../services/global-data.service';

@Injectable({
  providedIn: 'root'
})
export class NotFriendGuard implements CanActivate {
  constructor(
    private apiService: ApiService,
    private globalData: GlobalData,
    private location: Location,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.apiService.isFriend(+next.params.userId).pipe(
      mergeMap((result: Result<number>) => {
        // TODO 写完单聊之后，自己跟自己也是好友，把this.globalData.user.id == next.params.userId删除
        const isFriend = !!result.data || this.globalData.user.id == next.params.userId;
        isFriend && this.location.back();

        return of(!isFriend);
      })
    );
  }
}
