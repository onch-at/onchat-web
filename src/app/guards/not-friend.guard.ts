import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Result } from '../models/onchat.model';
import { OnChatService } from '../services/onchat.service';

@Injectable({
  providedIn: 'root'
})
export class NotFriendGuard implements CanActivate {
  constructor(private onChatService: OnChatService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable(observer => {
      this.onChatService.isFriend(+next.params.userId).subscribe((result: Result<number>) => {
        // TODO 写完单聊之后，自己跟自己也是好友，把this.onChatService.userId == next.params.userId删除
        const isFriend = Boolean(result.data) || this.onChatService.userId == next.params.userId;
        isFriend && history.go(-1);
        observer.next(!isFriend);
        return observer.complete();
      }, () => {
        observer.next(false);
        return observer.complete();
      });
    });
  }
}
