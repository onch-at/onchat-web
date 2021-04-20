import { Injectable } from '@angular/core';
import { ChatSessionType, LocalStorageKey } from '../common/enum';
import { ChatRequest, ChatSession, FriendRequest, User } from '../models/onchat.model';
import { EntityUtil } from '../utils/entity.util';
import { LocalStorage } from './local-storage.service';

/** 全局数据服务 */
@Injectable({
  providedIn: 'root'
})
export class GlobalData {
  /** 当前用户 */
  user: User = null;
  /** 记录当前所在的聊天室ID */
  chatroomId: number = null;
  /** 是否可以销毁（返回上一页） */
  canDeactivate: boolean = true;
  /** 我的收到好友申请列表 */
  receiveFriendRequests: FriendRequest[] = [];
  /** 我的发起的好友申请列表 */
  sendFriendRequests: FriendRequest[] = [];
  /** 路由导航中 */
  navigating: boolean = false;

  /** 计算未读消息总数 */
  unreadMsgCount = () => {
    this.totalUnreadChatRequestCount();

    const count = this.chatSessions.reduce((count, o) => (
      count + (o.unread || 0)
    ), 0);

    (navigator as any).setAppBadge?.(count);

    return count;
  };

  /** 未读的好友请求 */
  unreadFriendRequestCount = () => this.receiveFriendRequests.reduce((count, o) => (
    o.targetReaded ? count : count + 1
  ), 0) + this.sendFriendRequests.reduce((count, o) => (
    o.requesterReaded ? count : count + 1
  ), 0);

  /** 私聊聊天室列表 */
  private _privateChatrooms: ChatSession[] = [];
  /** 群聊聊天室列表 */
  private _groupChatrooms: ChatSession[] = [];
  /** 我收到的入群申请 */
  private _receiveChatRequests: ChatRequest[] = [];
  /** 我发送的入群申请 */
  private _sendChatRequests: ChatRequest[] = [];
  /** 缓存聊天列表 */
  private _chatSessions: ChatSession[] = [];

  constructor(
    private localStorage: LocalStorage
  ) { }

  reset() {
    this.user = null;
    this.chatSessions = [];
    this.receiveChatRequests = [];
    this.sendChatRequests = [];
    this.receiveFriendRequests = [];
    this.sendFriendRequests = [];
    this.privateChatrooms = [];
  }

  set receiveChatRequests(requests: ChatRequest[]) {
    this._receiveChatRequests = requests;
    this.sortReceiveChatRequests();
  }

  get receiveChatRequests() {
    return this._receiveChatRequests;
  }

  set sendChatRequests(requests: ChatRequest[]) {
    this._sendChatRequests = requests;
    this.sortSendChatRequests();
  }

  get sendChatRequests() {
    return this._sendChatRequests;
  }

  set chatSessions(chatSessions: ChatSession[]) {
    this._chatSessions = chatSessions;
    this.sortChatSessions();
    this.localStorage.set(LocalStorageKey.ChatSessions, this.chatSessions);
  }

  get chatSessions(): ChatSession[] {
    return this._chatSessions;
  }

  set privateChatrooms(chatrooms: ChatSession[]) {
    this._privateChatrooms = chatrooms.sort((a: ChatSession, b: ChatSession) => (
      a.title.localeCompare(b.title)
    ));
  }

  get privateChatrooms(): ChatSession[] {
    return this._privateChatrooms;
  }

  set groupChatrooms(chatrooms: ChatSession[]) {
    this._groupChatrooms = chatrooms.sort((a: ChatSession, b: ChatSession) => (
      a.title.localeCompare(b.title)
    ));
  }

  get groupChatrooms(): ChatSession[] {
    return this._groupChatrooms;
  }

  /**
   * 计算未读的聊天室通知消息数量
   */
  private totalUnreadChatRequestCount() {
    const chatSession = this.chatSessions.find(o => o.type === ChatSessionType.ChatroomNotice);

    if (chatSession) {
      chatSession.unread = this.receiveChatRequests.concat(this.sendChatRequests).reduce((count, o) => (
        o.readedList.includes(this.user.id) ? count : ++count
      ), 0);
    }
  }

  /**
   * 已读所有聊天室通知
   */
  readedChatRequest() {
    this.receiveChatRequests.forEach(o => o.readedList.push(this.user.id));
    this.sendChatRequests.forEach(o => o.readedList.push(this.user.id));
  }

  /**
   * 按照时间/置顶顺序排序聊天列表
   */
  sortChatSessions() {
    this.chatSessions.sort(EntityUtil.sortByUpdateTime).sort((a, b) => +b.sticky || 0 - +a.sticky || 0);
  }

  /**
   * 排序收到的入群申请
   */
  sortReceiveChatRequests() {
    this.receiveChatRequests.sort(EntityUtil.sortByUpdateTime);
  }

  /**
   * 排序发送的入群申请
   */
  sortSendChatRequests() {
    this.sendChatRequests.sort(EntityUtil.sortByUpdateTime);
  }
}
