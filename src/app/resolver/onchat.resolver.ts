import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FriendRequest, Result, User } from '../models/onchat.model';
import { OnChatService } from '../services/onchat.service';
import { SessionStorageService } from '../services/session-storage.service';

/**
 * 用户Resolve，根据路由参数中的userId来获得user
 */
@Injectable({
    providedIn: 'root',
})
export class UserResolve implements Resolve<Result<User> | User> {
    constructor(
        private onChatService: OnChatService,
        private sessionStorageService: SessionStorageService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<User>> | User {
        const userId = +route.params.userId;

        // 如果是自己
        if (this.onChatService.user && userId == this.onChatService.user.id) {
            return this.onChatService.user
        }

        // 去缓存里面找找
        const user = this.sessionStorageService.getUser(userId);
        if (user) { return user; }

        return this.onChatService.getUser(userId);
    }
}

/**
 * 获取自己给对方（根据路由参数userId）发起好友申请的Resolve
 */
@Injectable({
    providedIn: 'root',
})
export class FriendRequestByTargetIdResolve implements Resolve<Result<FriendRequest>> {
    constructor(
        private onChatService: OnChatService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<FriendRequest>> {
        const userId = +route.params.userId;

        return this.onChatService.getFriendRequestByTargetId(userId);
    }
}

/**
 * 获取对方（根据路由参数userId）给自己发起好友申请的Resolve
 */
@Injectable({
    providedIn: 'root',
})
export class FriendRequestBySelfIdResolve implements Resolve<Result<FriendRequest>> {
    constructor(
        private onChatService: OnChatService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<FriendRequest>> {
        const userId = +route.params.userId;

        return this.onChatService.getFriendRequestBySelfId(userId);
    }
}

/**
 * 获取好友申请
 */
@Injectable({
    providedIn: 'root',
})
export class FriendRequestResolve implements Resolve<Result<FriendRequest>> {
    constructor(
        private onChatService: OnChatService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<FriendRequest>> {
        const friendRequestId = +route.params.friendRequestId;

        return this.onChatService.getFriendRequestById(friendRequestId);
    }
}
