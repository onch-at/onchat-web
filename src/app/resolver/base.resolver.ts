import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Result } from '../models/interface.model';
import { OnChatService } from '../services/onchat.service';

@Injectable({
    providedIn: 'root',
})
export class UserIdResolve implements Resolve<Result<number> | number> {
    constructor(private onChatService: OnChatService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<number>> | number {
        const userId = this.onChatService.userId;
        if (userId) { return userId; }
        return this.onChatService.getUserId();
    }
}

// @Injectable({
//     providedIn: 'root',
// })
// export class ChatListResolve implements Resolve<ChatItem[]> {
//     constructor(private onChatService: OnChatService, private localStorageService: LocalStorageService) { }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ChatItem[] {
//         const data = this.localStorageService.get(LocalStorageKey.ChatList);
//         if (data) { return data; }
//     }
// }
