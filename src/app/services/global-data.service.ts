import { Inject, Injectable } from '@angular/core';
import { ChatSessionType, LocalStorageKey } from '../common/enum';
import { NAVIGATOR } from '../common/token';
import { ChatRequest, ChatSession, FriendRequest, User } from '../models/onchat.model';
import { EntityUtil } from '../utils/entity.util';
import { LocalStorage } from './local-storage.service';

/** 全局数据服务 */
@Injectable({
  providedIn: 'root'
})
export class GlobalData {
  get receiveChatRequests() { return this._receiveChatRequests; }
  set receiveChatRequests(requests: ChatRequest[]) {
    this._receiveChatRequests = requests;
    this.sortReceiveChatRequests();
  }

  get sendChatRequests() { return this._sendChatRequests; }
  set sendChatRequests(requests: ChatRequest[]) {
    this._sendChatRequests = requests;
    this.sortSendChatRequests();
  }

  get chatSessions(): ChatSession[] { return this._chatSessions; }
  set chatSessions(chatSessions: ChatSession[]) {
    this._chatSessions = chatSessions;
    this.sortChatSessions();
    this.localStorage.set(LocalStorageKey.ChatSessions, this.chatSessions);
  }

  get privateChatrooms(): ChatSession[] { return this._privateChatrooms; }
  set privateChatrooms(chatrooms: ChatSession[]) {
    this._privateChatrooms = chatrooms?.sort((a: ChatSession, b: ChatSession) => (
      a.title.localeCompare(b.title)
    ));
  }

  get groupChatrooms(): ChatSession[] { return this._groupChatrooms; }
  set groupChatrooms(chatrooms: ChatSession[]) {
    this._groupChatrooms = chatrooms?.sort((a: ChatSession, b: ChatSession) => (
      a.title.localeCompare(b.title)
    ));
  }

  get chatRichTextMap(): { [chatroomId: number]: string } { return this._chatRichTextMap; }
  set chatRichTextMap(map: { [chatroomId: number]: string }) {
    this._chatRichTextMap = map;
    this.localStorage.set(LocalStorageKey.ChatRichTextMap, map);
  }

  /** 计算未读消息总数 */
  get unreadMessage(): number {
    this.totalUnreadChatRequestCount();

    const count = this.chatSessions?.reduce((count, o) => (
      count + (o.unread || 0)
    ), 0);

    (this.navigator as any).setAppBadge?.(count);

    return count;
  }

  /** 未读的好友请求 */
  get unreadFriendRequest(): number {
    return this.receiveFriendRequests?.reduce((count, o) => (
      o.targetReaded ? count : count + 1
    ), 0) + this.sendFriendRequests?.reduce((count, o) => (
      o.requesterReaded ? count : count + 1
    ), 0);
  }

  /** 当前用户 */
  user: User;
  /** 记录当前所在的聊天室ID */
  chatroomId: number;
  /** 我的收到好友申请列表 */
  receiveFriendRequests: FriendRequest[];
  /** 我的发起的好友申请列表 */
  sendFriendRequests: FriendRequest[];
  /** 是否可以销毁（返回上一页） */
  canDeactivate = true;
  /** 路由导航中 */
  navigating = false;

  /** 私聊聊天室列表 */
  private _privateChatrooms: ChatSession[];
  /** 群聊聊天室列表 */
  private _groupChatrooms: ChatSession[];
  /** 我收到的入群申请 */
  private _receiveChatRequests: ChatRequest[];
  /** 我发送的入群申请 */
  private _sendChatRequests: ChatRequest[];
  /** 缓存聊天列表 */
  private _chatSessions: ChatSession[];
  /** 聊天富文本缓存 */
  private _chatRichTextMap: { [chatroomId: number]: string };

  constructor(
    private localStorage: LocalStorage,
    @Inject(NAVIGATOR) private navigator: Navigator
  ) {
    this.chatSessions = this.localStorage.get<ChatSession[]>(LocalStorageKey.ChatSessions);
    this.chatRichTextMap = this.localStorage.get<{ [chatroomId: number]: string }>(LocalStorageKey.ChatRichTextMap, {});
  }

  reset() {
    this.user = null;
    this.chatSessions = null;
    this.receiveChatRequests = null;
    this.sendChatRequests = null;
    this.receiveFriendRequests = null;
    this.sendFriendRequests = null;
    this.privateChatrooms = null;
    this.groupChatrooms = null;
    this.chatRichTextMap = {};
  }

  /**
   * 计算未读的聊天室通知消息数量
   */
  private totalUnreadChatRequestCount() {
    const chatSession = this.chatSessions?.find(o => o.type === ChatSessionType.ChatroomNotice);

    if (chatSession) {
      chatSession.unread = this.receiveChatRequests?.concat(this.sendChatRequests).reduce((count, o) => (
        o.readedList.includes(this.user?.id) ? count : ++count
      ), 0);
    }
  }

  /**
   * 已读所有聊天室通知
   */
  readedChatRequest() {
    this.receiveChatRequests?.forEach(o => o.readedList.push(this.user.id));
    this.sendChatRequests?.forEach(o => o.readedList.push(this.user.id));
  }

  /**
   * 按照时间/置顶顺序排序聊天列表
   */
  sortChatSessions() {
    this._chatSessions &&= [...this.chatSessions.sort(EntityUtil.sortByUpdateTime).sort((a, b) => +b.sticky || 0 - +a.sticky || 0)];
  }

  /**
   * 排序收到的入群申请
   */
  sortReceiveChatRequests() {
    this._receiveChatRequests &&= [...this.receiveChatRequests.sort(EntityUtil.sortByUpdateTime)];
  }

  /**
   * 排序发送的入群申请
   */
  sortSendChatRequests() {
    this._sendChatRequests &&= [...this.sendChatRequests.sort(EntityUtil.sortByUpdateTime)];
  }
}
