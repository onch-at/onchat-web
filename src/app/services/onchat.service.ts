import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { LocalStorageKey } from '../common/enum';
import { Login, Register } from '../models/form.model';
import { ChatItem, Chatroom, FriendRequest, Message, Result, User } from '../models/onchat.model';
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

const HTTP_OPTIONS_DEFAULT = {
  headers: new HttpHeaders(),
  withCredentials: true
};

@Injectable({
  providedIn: 'root'
})
export class OnChatService {
  /** 当前用户 */
  user: User = null;
  /** 记录当前所在的聊天室ID */
  chatroomId: number = null;
  /** 未读消息总数 */
  unreadMsgNum: number = 0;
  /** 全局阻塞加载 */
  globalLoading: boolean = false;

  /** 缓存聊天列表 */
  private _chatList: ChatItem[] = [];
  set chatList(chatList: ChatItem[]) {
    this._chatList = sortChatList(chatList);
    this.localStorageService.set(LocalStorageKey.ChatList, this.chatList);

    this.unreadMsgNum > 0 && (this.unreadMsgNum = 0);

    for (const chatItem of chatList) {
      // 计算未读消息总数
      // 如果有未读消息，且总未读数大于100，则停止遍历，提升性能
      if (chatItem.unread > 0 && (this.unreadMsgNum += chatItem.unread) >= 100) {
        break;
      }
    }
  }
  get chatList(): ChatItem[] {
    return this._chatList;
  }

  /** 我的收到好友申请列表 */
  receiveFriendRequests: FriendRequest[] = [];
  /** 我的发起的好友申请列表 */
  sendFriendRequests: FriendRequest[] = [];

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private feedbackService: FeedbackService,
  ) { }

  init(): void {
    /** 获取聊天列表 */
    this.getChatList().subscribe((result: Result<ChatItem[]>) => {
      this.chatList = result.data;
      // 看看有没有未读消息，有就放提示音
      this.chatList.some((v: ChatItem) => v.unread > 0) && this.feedbackService.booAudio.play();
    });

    this.getReceiveFriendRequests().subscribe((result: Result<FriendRequest[]>) => {
      if (result.data.length > 0) {
        this.receiveFriendRequests = result.data;
        this.feedbackService.dingDengAudio.play();
      }
    });

    this.getSendFriendRequests().subscribe((result: Result<FriendRequest[]>) => {
      if (result.data.length > 0) {
        this.sendFriendRequests = result.data;
      }
    });
  }

  /**
   * 登录
   * @param o
   */
  login(o: Login): Observable<Result<User>> {
    return this.http.post<Result<User>>(env.userLoginUrl, o, HTTP_OPTIONS_JSON);
  }

  /**
   * 登出
   */
  logout(): Observable<null> {
    return this.http.get<null>(env.userLogoutUrl);
  }

  /**
   * 检测是否已经登录
   * 成功登录,则返回User；否则返回false
   */
  checkLogin(): Observable<Result<boolean | User>> {
    return this.http.get<Result<boolean | User>>(env.userCheckLoginUrl);
  }

  /**
   * 注册
   * @param o
   */
  register(o: Register): Observable<Result<User>> {
    return this.http.post<Result<User>>(env.userRegisterUrl, o, HTTP_OPTIONS_JSON);
  }

  /**
   * 上传用户头像
   */
  uploadUserAvatar(avatar: Blob): Observable<Result<{ avatar: string, avatarThumbnail: string }>> {
    const formData: FormData = new FormData();
    formData.append('image', avatar);

    return this.http.post<Result<{ avatar: string, avatarThumbnail: string }>>(env.userUrl + 'avatar', formData, HTTP_OPTIONS_DEFAULT);
  }

  /**
   * 通过用户ID获取用户
   * @param userId 用户ID
   */
  getUser(userId: number): Observable<Result<User>> {
    return this.http.get<Result<User>>(env.userUrl + userId);
  }

  /**
   * 获取用户ID
   * 废弃：获取用户ID请采用checkLogin，成功登录则返回用户ID
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
   * 获取聊天室
   * @param id 聊天室ID
   */
  getChatroom(id: number): Observable<Result<Chatroom>> {
    return this.http.get<Result<Chatroom>>(env.chatroomUrl + id);
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
  getChatRecords(id: number, msgId?: number): Observable<Result<Message[]>> {
    return this.http.get<Result<Message[]>>(env.chatroomUrl + id + '/records/' + msgId);
  }

  /**
   * 置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  stickyChatItem(id: number): Observable<Result> {
    return this.http.put<Result>(env.chatListStickyUrl + id, null);
  }

  /**
   * 取消置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  unstickyChatItem(id: number): Observable<Result> {
    return this.http.put<Result>(env.chatListUnstickyUrl + id, null);
  }

  /**
   * 将聊天列表子项设为已读
   * @param chatroomId 聊天室ID
   */
  readed(chatroomId: number): Observable<Result> {
    return this.http.put<Result>(env.chatListReadedUrl + chatroomId, null);
  }

  /**
   * 将聊天列表子项设为未读
   * @param chatroomId 聊天室ID
   */
  unread(chatroomId: number): Observable<Result> {
    return this.http.put<Result>(env.chatListUnreadUrl + chatroomId, null);
  }

  /**
   * 获取我的收到好友申请
   */
  getReceiveFriendRequests(): Observable<Result<FriendRequest[]>> {
    return this.http.get<Result<FriendRequest[]>>(env.friendUrl + 'requests/receive');
  }

  /**
   * 获取我的发起的好友申请（不包含已经同意的）
   */
  getSendFriendRequests(): Observable<Result<FriendRequest[]>> {
    return this.http.get<Result<FriendRequest[]>>(env.friendUrl + 'requests/send');
  }

  /**
   * 根据被申请人的UID来获取FriendRequest
   * @param targetId 被申请人的ID
   */
  getFriendRequestByTargetId(targetId: number): Observable<Result<FriendRequest>> {
    return this.http.get<Result<FriendRequest>>(env.friendUrl + 'request/target/' + targetId);
  }

  /**
   * 根据申请人的UID来获取FriendRequest
   * @param selfId 申请人的UID
   */
  getFriendRequestBySelfId(selfId: number): Observable<Result<FriendRequest>> {
    return this.http.get<Result<FriendRequest>>(env.friendUrl + 'request/self/' + selfId);
  }

  /**
   * 根据ID来获取FriendRequest
   * @param id FriendRequest Id
   */
  getFriendRequestById(id: number): Observable<Result<FriendRequest>> {
    return this.http.get<Result<FriendRequest>>(env.friendUrl + 'request/' + id);
  }

  /**
   * 设置好友别名
   * @param chatroomId 私聊聊天室ID
   * @param alias 别名
   */
  setFriendAlias(chatroomId: number, alias: string): Observable<Result> {
    return this.http.put<Result>(env.friendUrl + 'alias/' + chatroomId, { alias });
  }

  /**
   * 判断自己跟对方是否为好友关系
   * 如果是好友关系，则返回私聊房间号；否则返回零
   * @param targetId 对方UserId
   */
  isFriend(targetId: number): Observable<Result<number>> {
    return this.http.get<Result<number>>(env.friendUrl + targetId + '/isfriend');
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
