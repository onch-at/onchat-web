import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { ChatItem, Chatroom, MsgItem } from '../models/entity.model';
import { LoginForm, RegisterForm } from '../models/form.model';
import { Result } from '../models/result.model';

const HTTP_OPTIONS_JSON = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true
};

const HTTP_OPTIONS_FORM = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class OnChatService {
  /** 存储URL，以便在登录后可以重定向 */
  redirectUrl: string;

  constructor(private http: HttpClient) { }

  getUsernameByUid(uid: number) {
    return this.http.get('/api/php/history.php?history=' + uid, HTTP_OPTIONS_JSON);
  }

  /**
   * 登录
   * @param o 
   */
  login(o: LoginForm): Observable<Result<any>> {
    return this.http.post<Result<any>>(env.userLoginUrl, o, HTTP_OPTIONS_JSON);
  }

  /**
   * 登出
   */
  logout(): Observable<any> {
    return this.http.get<any>(env.userLogoutUrl);
  }

  /**
   * 检测是否已经登录
   */
  checkLogin(): Observable<Result<boolean>> {
    return this.http.get<Result<boolean>>(env.userCheckLoginUrl);
  }

  /**
   * 注册
   * @param o 
   */
  register(o: RegisterForm): Observable<Result<any>> {
    return this.http.post<Result<any>>(env.userRegisterUrl, o, HTTP_OPTIONS_JSON);
  }

  /**
   * 获取用户ID
   */
  getUserId(): Observable<Result<number>> {
    return this.http.get<Result<number>>(env.userIdUrl);
  }

  /**
   * 获取该用户下所有聊天室
   */
  getChatrooms(): Observable<Result<Chatroom[]>> {
    return this.http.get<Result<Chatroom[]>>(env.userChatroomsUrl);
  }

  /**
   * 获取用户的聊天列表
   */
  getChatList(): Observable<Result<ChatItem[]>> {
    return this.http.get<Result<ChatItem[]>>(env.userChatListUrl);
  }

  /**
   * 获取聊天室名称
   * @param id 聊天室ID
   */
  getChatroomName(id: number): Observable<Result<string>> {
    return this.http.get<Result<string>>(env.chatroomUrl + id + '/name');
  }

  /**
   * 获取聊天记录
   * @param id 聊天室ID
   * @param page 页码
   */
  getChatRecords(id: number, page: number): Observable<Result<MsgItem[]>> {
    return this.http.get<Result<MsgItem[]>>(env.chatroomUrl + id + '/records/' + page);
  }

  /**
   * 置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  stickyChatItem(id: number): Observable<Result<any>> {
    return this.http.put<Result<any>>(env.chatListStickyUrl + id, null);
  }

  /**
   * 取消置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  unstickyChatItem(id: number): Observable<Result<any>> {
    return this.http.put<Result<any>>(env.chatListUnstickyUrl + id, null);
  }
}
