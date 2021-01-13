import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ChatRequest, Result } from "../models/onchat.model";
import { GlobalDataService } from "../services/global-data.service";
import { OnChatService } from "../services/onchat.service";

/**
 * 用户Resolve，根据路由参数中的userId来获得user
 */
@Injectable({
    providedIn: 'root',
})
export class ChatRequestResolve implements Resolve<Result<ChatRequest> | ChatRequest> {
    constructor(
        private onChatService: OnChatService,
        private globalDataService: GlobalDataService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Result<ChatRequest>> | ChatRequest {
        const chatRequestId = +route.params.chatRequestId;
        const chatRequest = this.globalDataService.receiveChatRequests.find(o => o.id === chatRequestId);

        if (chatRequest) { return chatRequest; }

        return this.onChatService.getReceiveChatRequestById(chatRequestId);
    }
}