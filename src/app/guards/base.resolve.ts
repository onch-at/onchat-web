import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { ChatItem } from '../models/entity.model';
import { Result } from '../models/result.model';
import { LocalStorageService } from '../services/local-storage.service';
import { OnChatService } from '../services/onchat.service';

@Injectable({
    providedIn: 'root',
})
export class UserIdResolve implements Resolve<Result<number>> {
    constructor(private onChatService: OnChatService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<number>> {
        return this.onChatService.getUserId();
    }
}

@Injectable({
    providedIn: 'root',
})
export class ChatListResolve implements Resolve<ChatItem[]> {
    constructor(private onChatService: OnChatService, private localStorageService: LocalStorageService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): ChatItem[] {
        const data = this.localStorageService.get(env.chatListKey);
        console.log(data)
        if (data) { return data; }
    }
}
