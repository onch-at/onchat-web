import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FriendRequest, Result } from '../models/onchat.model';
import { FriendService } from '../services/apis/friend.service';

/**
 * 获取自己给对方（根据路由参数userId）发起好友申请的Resolve
 */
@Injectable({
  providedIn: 'root',
})
export class FriendRequestByTargetIdResolve implements Resolve<Result<FriendRequest>> {
  constructor(private friendService: FriendService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<FriendRequest>> {
    const userId = +route.params.userId;

    return this.friendService.getRequestByTargetId(userId);
  }
}

/**
 * 获取对方（根据路由参数userId）给自己发起好友申请的Resolve
 */
@Injectable({
  providedIn: 'root',
})
export class FriendRequestBySelfIdResolve implements Resolve<Result<FriendRequest>> {
  constructor(private friendService: FriendService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<FriendRequest>> {
    const userId = +route.params.userId;

    return this.friendService.getRequestByRequesterId(userId);
  }
}

/**
 * 获取好友申请
 */
@Injectable({
  providedIn: 'root',
})
export class FriendRequestResolve implements Resolve<Result<FriendRequest>> {
  constructor(private friendService: FriendService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<FriendRequest>> {
    const friendRequestId = +route.params.friendRequestId;

    return this.friendService.getRequestById(friendRequestId);
  }
}
