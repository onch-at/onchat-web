import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatRequest, Result } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  /**
   * 获得我收到的入群申请
   */
  getReceiveRequests(): Observable<Result<ChatRequest[]>> {
    return this.http.get<Result<ChatRequest[]>>(environment.chatCtx + '/requests/receive');
  }

  /**
   * 通过请求id来获取我收到的入群申请
   * @param id 入群申请ID
   */
  getReceiveChatRequestById(id: number): Observable<Result<ChatRequest>> {
    return this.http.get<Result<ChatRequest>>(environment.chatCtx + '/requests/receive/' + id);
  }

  /**
   * 已读入群申请
   */
  readedRequests(): Observable<Result> {
    return this.http.put<Result>(environment.chatCtx + '/requests/readed', null);
  }

  /**
   * 通过请求id来获取我发送的入群申请
   * @param id 入群申请ID
   */
  getSendRequestById(id: number): Observable<Result<ChatRequest>> {
    return this.http.get<Result<ChatRequest>>(environment.chatCtx + '/requests/send/' + id);
  }

  /**
   * 获取我发送的所有入群申请
   */
  getSendRequests(): Observable<Result<ChatRequest[]>> {
    return this.http.get<Result<ChatRequest[]>>(environment.chatCtx + '/requests/send');
  }
}
