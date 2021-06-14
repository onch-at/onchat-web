import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatRequest, Result } from '../models/onchat.model';
import { ApiService } from '../services/api.service';
import { GlobalData } from '../services/global-data.service';

/**
 * 群聊申请Resolve，根据路由参数中的chatRequestId来获得我收到的ChatRequest
 */
@Injectable({
  providedIn: 'root',
})
export class ReceiveChatRequestResolve implements Resolve<ChatRequest> {
  constructor(
    private apiService: ApiService,
    private globalData: GlobalData
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChatRequest> | ChatRequest {
    const chatRequestId = +route.params.chatRequestId;
    const chatRequest = this.globalData.receiveChatRequests.find(o => o.id === chatRequestId);

    if (chatRequest) { return chatRequest; }

    return this.apiService.getReceiveChatRequestById(chatRequestId).pipe(
      map(({ data }: Result<ChatRequest>) => data)
    );
  }
}

/**
 * 群聊申请Resolve，根据路由参数中的chatRequestId来获得我发送的ChatRequest
 */
@Injectable({
  providedIn: 'root',
})
export class SendChatRequestResolve implements Resolve<ChatRequest> {
  constructor(
    private apiService: ApiService,
    private globalData: GlobalData
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ChatRequest> | ChatRequest {
    const chatRequestId = +route.params.chatRequestId;
    const chatRequest = this.globalData.sendChatRequests.find(o => o.id === chatRequestId);

    if (chatRequest) { return chatRequest; }

    return this.apiService.getSendChatRequestById(chatRequestId).pipe(
      map(({ data }: Result<ChatRequest>) => data)
    );
  }
}