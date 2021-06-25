import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Result } from '../models/onchat.model';
import { FriendService } from '../services/apis/friend.service';
import { GlobalData } from '../services/global-data.service';

@Injectable({
  providedIn: 'root'
})
export class NotFriendGuard implements CanActivate {
  constructor(
    private friendService: FriendService,
    private globalData: GlobalData,
    private navCtrl: NavController,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.friendService.isFriend(+next.params.userId).pipe(
      map(({ data }: Result<number>) => {
        // TODO 写完单聊之后，自己跟自己也是好友，把this.globalData.user.id == next.params.userId删除
        const isFriend = !!data || this.globalData.user?.id === next.params.userId;
        isFriend && this.navCtrl.back();

        return !isFriend;
      })
    );
  }
}
