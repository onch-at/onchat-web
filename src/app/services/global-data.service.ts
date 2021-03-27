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
  /** 缓存聊天列表的分页页码 */
  chatSessionsPage: number = 1;
  /** 私聊聊天室列表的分页页码 */
  privateChatroomsPage: number = 1;
  /** 群聊聊天室列表的分页页码 */
  groupChatroomsPage: number = 1;
  /** 路由导航中 */
  navigating: boolean = false;

  /** 未读消息总数 */
  private _unreadMsgCount: number = 0;
  /** 私聊聊天室列表 */
  private _privateChatrooms: ChatSession[] = [];
  /** 群聊聊天室列表 */
  private _groupChatrooms: ChatSession[] = [];
  /** 我收到的群通知 */
  private _receiveChatRequests: ChatRequest[] = [];
  /** 缓存聊天列表 */
  private _chatSessions: ChatSession[] = [];

  constructor(
    private localStorage: LocalStorage
  ) { }

  reset() {
    this.user = null;
    this.chatSessionsPage = 1;
    this.privateChatroomsPage = 1;
    this.chatSessions = [];
    this.receiveChatRequests = [];
    this.receiveFriendRequests = [];
    this.sendFriendRequests = [];
    this.privateChatrooms = [];
  }

  set receiveChatRequests(requests: ChatRequest[]) {
    this._receiveChatRequests = requests;
    this.sortChatRequests();
  }

  get receiveChatRequests() {
    return this._receiveChatRequests;
  }

  set unreadMsgCount(num: number) {
    this._unreadMsgCount = num > 0 ? num : 0;
    'setAppBadge' in navigator && (navigator as any).setAppBadge(this._unreadMsgCount);
  }

  get unreadMsgCount() {
    return this._unreadMsgCount;
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
   * 计算未读消息数
   */
  totalUnreadMsgCount() {
    this.unreadMsgCount &&= 0;

    this.totalUnreadChatRequestCount();

    for (const chatSession of this.chatSessions) {
      // 计算未读消息总数，如果有未读消息，
      // 且总未读数大于100，则停止遍历
      if (chatSession.unread > 0 && (this.unreadMsgCount += chatSession.unread) >= 100) {
        return;
      }
    }
  }

  /**
   * 计算未读的聊天室通知消息数量
   */
  private totalUnreadChatRequestCount() {
    const unreadCount = this.receiveChatRequests.reduce((count, o) => (
      o.readedList.includes(this.user.id) ? count : ++count
    ), 0);

    const chatSession = this.chatSessions.find(o => o.type === ChatSessionType.ChatroomNotice);
    if (chatSession) {
      chatSession.unread = unreadCount;
    }
  }

  /**
   * 按照时间/置顶顺序排序聊天列表
   */
  sortChatSessions() {
    this.chatSessions.sort(EntityUtil.sortByUpdateTime).sort((a, b) => +b.sticky || 0 - +a.sticky || 0);
  }

  /**
   * 排序聊天室通知
   */
  sortChatRequests() {
    this.receiveChatRequests.sort(EntityUtil.sortByUpdateTime);
  }
}
