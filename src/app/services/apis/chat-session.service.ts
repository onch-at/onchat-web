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
   * 置顶聊天会话
   * @param id 聊天会话ID
   */
  sticky(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.chatSessionUrl}/sticky/${id}`, null);
  }

  /**
   * 取消置顶聊天会话
   * @param id 聊天会话ID
   */
  unsticky(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.chatSessionUrl}/unsticky/${id}`, null);
  }

  /**
   * 将聊天会话设为已读
   * @param id 聊天会话ID
   */
  readed(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.chatSessionUrl}/readed/${id}`, null);
  }

  /**
   * 将聊天会话设为未读
   * @param id 聊天会话ID
   */
  unread(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.chatSessionUrl}/unread/${id}`, null);
  }

  /**
   * 隐藏聊天会话
   * @param id 聊天会话ID
   */
  hide(id: number): Observable<Result> {
    return this.http.put<Result>(`${environment.chatSessionUrl}/hide/${id}`, null);
  }
}
