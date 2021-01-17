import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Result } from '../models/onchat.model';
import { GlobalData } from '../services/global-data.service';
import { OnChatService } from '../services/onchat.service';

@Injectable({
  providedIn: 'root'
})
export class NotFriendGuard implements CanActivate {
  constructor(
    private onChatService: OnChatService,
    private globalData: GlobalData,
    private location: Location,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable(observer => {
      this.onChatService.isFriend(+next.params.userId).subscribe((result: Result<number>) => {
        // TODO 写完单聊之后，自己跟自己也是好友，把this.globalData.user.id == next.params.userId删除
        const isFriend = !!result.data || this.globalData.user.id == next.params.userId;
        isFriend && this.location.back();

        observer.next(!isFriend);
        observer.complete();
      });
    });
  }
}
