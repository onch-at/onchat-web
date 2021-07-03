import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatSession, Result } from 'src/app/models/onchat.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatSessionService {

  constructor(private http: HttpClient) { }

  /**
   * 获取用户的聊天列表
   */
  getChatSession(): Observable<Result<ChatSession[]>> {
    return this.http.get<Result<ChatSession[]>>(environment.chatSessionUrl);
  }

  /**
   * 置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  stickyChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.chatSessionUrl}/sticky/${id}`, null);
  }

  /**
   * 取消置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  unstickyChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.chatSessionUrl}/unsticky/${id}`, null);
  }

  /**
   * 将聊天列表子项设为已读
   * @param id 聊天列表子项ID
   */
  readedChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.chatSessionUrl}/readed/${id}`, null);
  }

  /**
   * 将聊天列表子项设为未读
   * @param id 聊天列表子项ID
   */
  unreadChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.chatSessionUrl}/unread/${id}`, null);
  }
}
