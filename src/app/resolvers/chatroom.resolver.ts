import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { SessionStorageKey } from "../common/enum";
import { Chatroom, Result } from "../models/onchat.model";
import { OnChatService } from "../services/onchat.service";
import { SessionStorageService } from "../services/session-storage.service";

/**
 * 聊天室Resolve，根据路由参数中的chatroomId来获得chatroom
 */
@Injectable({
    providedIn: 'root',
})
export class ChatroomResolve implements Resolve<Result<Chatroom> | Chatroom> {
    constructor(
        private onChatService: OnChatService,
        private sessionStorageService: SessionStorageService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<Chatroom>> | Chatroom {
        const chatroomId = +route.params.chatroomId;

        // 去缓存里面找找
        const chatroom = this.sessionStorageService.getItemFromMap<Chatroom>(SessionStorageKey.ChatroomMap, chatroomId);
        if (chatroom) { return chatroom; }

        return this.onChatService.getChatroom(chatroomId);
    }
}