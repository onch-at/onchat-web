import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatItem } from '../models/entity.model';
import { Result } from '../models/result.model';
import { OnChatService } from '../services/onchat.service';

@Injectable({
    providedIn: 'root',
})
export class ChatListResolve implements Resolve<Result<ChatItem[]>> {
    constructor(private onChatService: OnChatService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<ChatItem[]>> {
        return this.onChatService.getChatList();
    }
}
