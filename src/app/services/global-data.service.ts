import { Injectable } from '@angular/core';
import { LocalStorageKey } from '../common/enum';
import { ChatItem, FriendRequest, User } from '../models/onchat.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
  /** 当前用户 */
  private _user: User = null;
  /** 记录当前所在的聊天室ID */
  private _chatroomId: number = null;
  /** 未读消息总数 */
  private _unreadMsgCount: number = 0;
  /** 是否可以销毁（返回上一页） */
  private _canDeactivate: boolean = true;
  /** 我的收到好友申请列表 */
  private _receiveFriendRequests: FriendRequest[] = [];
  /** 我的发起的好友申请列表 */
  private _sendFriendRequests: FriendRequest[] = [];
  /** 缓存聊天列表 */
  private _chatList: ChatItem[] = [];
  /** 缓存聊天列表的分页页码 */
  private _chatListPage: number = 1;
  /** 私聊聊天室列表 */
  private _privateChatrooms: ChatItem[] = [];
  /** 私聊聊天室列表的分页页码 */
  private _privateChatroomsPage: number = 1;

  constructor(
    private localStorageService: LocalStorageService,
  ) { }

  set user(user: User) {
    this._user = user;
  }

  get user() {
    return this._user;
  }

  set chatroomId(id: number) {
    this._chatroomId = id;
  }

  get chatroomId() {
    return this._chatroomId;
  }

  set canDeactivate(deactivate: boolean) {
    this._canDeactivate = deactivate;
  }

  get canDeactivate() {
    return this._canDeactivate;
  }

  set receiveFriendRequests(friendRequests: FriendRequest[]) {
    this._receiveFriendRequests = friendRequests;
  }

  get receiveFriendRequests() {
    return this._receiveFriendRequests;
  }

  set sendFriendRequests(friendRequests: FriendRequest[]) {
    this._sendFriendRequests = friendRequests;
  }

  get sendFriendRequests() {
    return this._sendFriendRequests;
  }

  set unreadMsgCount(num: number) {
    this._unreadMsgCount = num;
  }

  get unreadMsgCount() {
    return this._unreadMsgCount;
  }

  set chatList(chatList: ChatItem[]) {
    this._chatList = sortChatList(chatList);
    this.localStorageService.set(LocalStorageKey.ChatList, this.chatList);

    if (this.unreadMsgCount > 0) {
      this.unreadMsgCount = 0;
    }

    for (const chatItem of chatList) {
      // 计算未读消息总数
      // 如果有未读消息，
      // 且总未读数大于100，则停止遍历
      if (chatItem.unread > 0 && (this.unreadMsgCount += chatItem.unread) >= 100) {
        break;
      }
    }

    if ('setAppBadge' in navigator) {
      (navigator as any).setAppBadge(this.unreadMsgCount);
    }
  }

  get chatList(): ChatItem[] {
    return this._chatList;
  }

  set chatListPage(page: number) {
    this._chatListPage = page;
  }

  get chatListPage() {
    return this._chatListPage;
  }

  set privateChatrooms(privateChatrooms: ChatItem[]) {
    this._privateChatrooms = privateChatrooms.sort((a: ChatItem, b: ChatItem) => {
      return a.name.localeCompare(b.name);
    });
  }

  get privateChatrooms(): ChatItem[] {
    return this._privateChatrooms;
  }

  set privateChatroomsPage(page: number) {
    this._privateChatroomsPage = page;
  }

  get privateChatroomsPage() {
    return this._privateChatroomsPage;
  }
}

/**
 * 按照时间/置顶顺序排序聊天列表
 * @param chatList
 */
export function sortChatList(chatList: ChatItem[]): ChatItem[] {
  return chatList.sort((a: ChatItem, b: ChatItem) => b.updateTime - a.updateTime).sort((a: ChatItem, b: ChatItem) => +b.sticky - +a.sticky);
}
