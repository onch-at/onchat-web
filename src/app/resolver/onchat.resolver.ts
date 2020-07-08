import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Result, User } from '../models/onchat.model';
import { OnChatService } from '../services/onchat.service';
import { SessionStorageService } from '../services/session-storage.service';

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
        // 先去缓存里面找找
        const user = this.sessionStorageService.getUser(userId);
        if (user) { return user; }

        return this.onChatService.getUser(userId);
    }
}
