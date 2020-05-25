import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { LocalStorageKey } from '../common/enum';
import { Login, Register } from '../models/form.model';
import { ChatItem, Chatroom, MsgItem, Result } from '../models/interface.model';
import { FeedbackService } from './feedback.service';
import { LocalStorageService } from './local-storage.service';

const HTTP_OPTIONS_JSON = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }),
  withCredentials: true
};

const HTTP_OPTIONS_FORM = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class OnChatService {
  /** 缓存登录状态 */
  isLogin: boolean = null;
  /** 缓存用户ID */
  userId: number = null;
  /** 记录当前所在的聊天室ID */
  chatroomId: number = null;
  /** 未读消息总数 */
  unreadNum: number = 0;
  /** 缓存聊天列表 */
  private _chatList: ChatItem[] = [];
  set chatList(chatList: ChatItem[]) {
    this.unreadNum = 0;
    for (const chatItem of chatList) {
      // 如果有未读消息，且总未读数大于100，则停止遍历，提升性能
      if (chatItem.unread > 0 && (this.unreadNum += chatItem.unread) >= 100) {
        break;
      }
    }
    this._chatList = sortChatList(chatList);
    this.localStorageService.set(LocalStorageKey.ChatList, this.chatList);
  }
  get chatList(): ChatItem[] {
    return this._chatList;
  }
  /** 气泡消息工具条的实例 */
  bubbleToolbarPopover: HTMLIonPopoverElement;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private feedbackService: FeedbackService,
  ) { }

  init() {
    this.getChatList().subscribe((result: Result<ChatItem[]>) => {
      this.chatList = result.data;
      this.localStorageService.set(LocalStorageKey.ChatList, this.chatList);
      for (const chatItem of this.chatList) {
        if (chatItem.unread > 0) {
          this.feedbackService.msgAudio.play();
          break;
        }
      }
    });

    this.userId == null && this.getUserId().subscribe((o: Result<number>) => {
      if (o.code == 0) { this.userId = o.data; }
    });
  }

  getUsernameByUid(uid: number) {
    return this.http.get('/api/php/history.php?history=' + uid, HTTP_OPTIONS_JSON);
  }

  /**
   * 登录
   * @param o 
   */
  login(o: Login): Observable<Result<number>> {
    return this.http.post<Result<null>>(env.userLoginUrl, o, HTTP_OPTIONS_JSON);
  }

  /**
   * 登出
   */
  logout(): Observable<null> {
    return this.http.get<null>(env.userLogoutUrl);
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
  register(o: Register): Observable<Result<number>> {
    return this.http.post<Result<null>>(env.userRegisterUrl, o, HTTP_OPTIONS_JSON);
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
   * @param msgId 页码
   */
  getChatRecords(id: number, msgId?: number): Observable<Result<MsgItem[]>> {
    return this.http.get<Result<MsgItem[]>>(env.chatroomUrl + id + '/records/' + msgId);
  }

  /**
   * 置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  stickyChatItem(id: number): Observable<Result<null>> {
    return this.http.put<Result<null>>(env.chatListStickyUrl + id, null);
  }

  /**
   * 取消置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  unstickyChatItem(id: number): Observable<Result<null>> {
    return this.http.put<Result<null>>(env.chatListUnstickyUrl + id, null);
  }

  /**
   * 将聊天列表子项设为已读
   * @param chatroomId 聊天室ID
   */
  readed(chatroomId: number): Observable<Result<null>> {
    return this.http.put<Result<null>>(env.chatListReadedUrl + chatroomId, null);
  }

  /**
   * 将聊天列表子项设为未读
   * @param chatroomId 聊天室ID
   */
  unread(chatroomId: number): Observable<Result<null>> {
    return this.http.put<Result<null>>(env.chatListUnreadUrl + chatroomId, null);
  }
}

/**
 * 按照时间/置顶顺序排序聊天列表
 * @param chatList 
 */
export function sortChatList(chatList: ChatItem[]): ChatItem[] {
  chatList.sort((a: ChatItem, b: ChatItem) => b.updateTime - a.updateTime);

  chatList.sort((a: ChatItem, b: ChatItem) => +b.sticky - +a.sticky);

  return chatList;
}
