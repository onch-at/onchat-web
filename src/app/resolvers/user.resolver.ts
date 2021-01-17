import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Result, User } from "../models/onchat.model";
import { GlobalData } from "../services/global-data.service";
import { OnChatService } from "../services/onchat.service";

/**
 * 用户Resolve，根据路由参数中的userId来获得user
 */
@Injectable({
    providedIn: 'root',
})
export class UserResolve implements Resolve<Result<User> | User> {
    constructor(
        private onChatService: OnChatService,
        private globalData: GlobalData
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<User>> | User {
        const userId = +route.params.userId;
        const { user } = this.globalData;

        return (user?.id === userId) ? user : this.onChatService.getUser(userId);
    }
}