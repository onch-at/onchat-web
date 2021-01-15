import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment as env } from '../../environments/environment';
import { AvatarData } from '../components/modals/avatar-cropper/avatar-cropper.component';
import { Login, Register, UserInfo } from '../models/form.model';
import { ChatMember, ChatRequest, Chatroom, ChatSession, FriendRequest, Message, Result, User } from '../models/onchat.model';
import { FeedbackService } from './feedback.service';
import { GlobalDataService } from './global-data.service';

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

  constructor(
    private http: HttpClient,
    private globalDataService: GlobalDataService,
    private feedbackService: FeedbackService,
  ) { }

  init(): void {
    this.initChatSession().subscribe();

    this.getReceiveFriendRequests().subscribe((result: Result<FriendRequest[]>) => {
      if (result.data?.length) {
        this.globalDataService.receiveFriendRequests = result.data;
      }
    });

    this.getSendFriendRequests().subscribe((result: Result<FriendRequest[]>) => {
      if (result.data?.length) {
        this.globalDataService.sendFriendRequests = result.data;
      }
    });
  }

  initChatSession() {
    this.globalDataService.chatSessionsPage = 1;

    return this.getChatSession().pipe(
      mergeMap((result: Result<ChatSession[]>) => {
        this.globalDataService.chatSessions = result.data;
        return this.getReceiveChatRequests();
      }),

      mergeMap((result: Result<ChatRequest[]>) => {
        if (result.data?.length) {
          this.globalDataService.receiveChatRequests = result.data;
        }
        this.globalDataService.totalUnreadMsgCount();

        return of(null);
      })
    );
  }

  /**
   * 获取缓存参数
   * 附带此参数的请求可被缓存拦截器拦截并缓存
   * @param cacheTime 缓存时间,默认半小时
   */
  private getCacheParam(cacheTime: number = 1800000): { [param: string]: string } {
    return { cache: cacheTime + '' };
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
   * @param avatar 头像
   */
  uploadUserAvatar(avatar: Blob): Observable<Result<AvatarData>> {
    const formData: FormData = new FormData();
    formData.append('image', avatar);

    return this.http.post<Result<AvatarData>>(env.userUrl + 'avatar', formData, HTTP_OPTIONS_DEFAULT);
  }

  /**
   * 保存用户信息
   * @param userInfo
   */
  saveUserInfo(userInfo: UserInfo): Observable<Result<UserInfo>> {
    return this.http.put<Result<UserInfo>>(env.userUrl + 'info', userInfo, HTTP_OPTIONS_JSON);
  }

  /**
   * 通过用户ID获取用户
   * @param userId 用户ID
   */
  getUser(userId: number): Observable<Result<User>> {
    return this.http.get<Result<User>>(env.userUrl + userId, { params: this.getCacheParam() });
  }

  /**
   * 获取用户的聊天列表
   */
  getChatSession(): Observable<Result<ChatSession[]>> {
    return this.http.get<Result<ChatSession[]>>(env.userUrl + 'chatsession');
  }

  /**
   * 获取私聊聊天室列表
   */
  getPrivateChatrooms(): Observable<Result<ChatSession[]>> {
    return this.http.get<Result<ChatSession[]>>(env.userUrl + 'chatrooms/private');
  }

  /**
   * 获取聊天室
   * @param id 聊天室ID
   */
  getChatroom(id: number): Observable<Result<Chatroom>> {
    return this.http.get<Result<Chatroom>>(env.chatroomUrl + id, { params: this.getCacheParam() });
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
   * 获取群聊成员
   * @param id 聊天室ID
   */
  getChatMembers(id: number): Observable<Result<ChatMember[]>> {
    return this.http.get<Result<ChatMember[]>>(env.chatroomUrl + id + '/members', { params: this.getCacheParam() });
  }

  /**
   * 上传聊天室头像
   * @param id 聊天室ID
   * @param avatar 头像
   */
  uploadChatroomAvatar(id: number, avatar: Blob): Observable<Result<AvatarData>> {
    const formData: FormData = new FormData();
    formData.append('image', avatar);

    return this.http.post<Result<AvatarData>>(env.chatroomUrl + id + '/avatar', formData, HTTP_OPTIONS_DEFAULT);
  }

  /**
   * 置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  stickyChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${env.userUrl}chatsession/sticky/${id}`, null);
  }

  /**
   * 取消置顶聊天列表子项
   * @param id 聊天列表子项ID
   */
  unstickyChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${env.userUrl}chatsession/unsticky/${id}`, null);
  }

  /**
   * 将聊天列表子项设为已读
   * @param id 聊天列表子项ID
   */
  readedChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${env.userUrl}chatsession/readed/${id}`, null);
  }

  /**
   * 将聊天列表子项设为未读
   * @param id 聊天列表子项ID
   */
  unreadChatSession(id: number): Observable<Result> {
    return this.http.put<Result>(`${env.userUrl}chatsession/unread/${id}`, null);
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

  /**
   * 获得我收到的入群申请
   */
  getReceiveChatRequests(): Observable<Result<ChatRequest[]>> {
    return this.http.get<Result<ChatRequest[]>>(env.chatUrl + 'requests/receive');
  }

  /**
   * 通过请求id来获取我收到的入群申请
   * @param id 入群申请ID
   * @returns
   */
  getReceiveChatRequestById(id: number): Observable<Result<ChatRequest>> {
    return this.http.get<Result<ChatRequest>>(env.chatUrl + 'requests/receive/' + id);
  }

  /**
   * 已读入群申请
   */
  readedChatRequests(): Observable<Result> {
    return this.http.put<Result>(env.chatUrl + 'requests/readed', null);
  }
}
