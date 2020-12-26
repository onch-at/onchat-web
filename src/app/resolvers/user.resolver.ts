import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { SessionStorageKey } from "../common/enum";
import { Result, User } from "../models/onchat.model";
import { OnChatService } from "../services/onchat.service";
import { SessionStorageService } from "../services/session-storage.service";

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

        // 去缓存里面找找
        const user = this.sessionStorageService.getItemFromMap<User>(SessionStorageKey.UserMap, userId);
        if (user) { return user; }

        return this.onChatService.getUser(userId);
    }
}