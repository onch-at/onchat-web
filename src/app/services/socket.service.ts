import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { first, timeout } from 'rxjs/operators';
import { SocketEvent } from '../common/enum';
import { Message } from '../models/onchat.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /** 初始化后的可观察对象 */
  private init$: Subject<void> = new Subject();

  constructor(
    private socket: Socket,
    private cookieService: CookieService,
  ) { }

  onInit(): Observable<void> {
    return this.init$;
  }

  /**
   * 初始化时执行，让后端把用户加入相应的房间
   */
  init() {
    this.on(SocketEvent.Init).pipe(
      timeout(5000),
      first()
    ).subscribe(() => this.init$.next());

    this.emit(SocketEvent.Init, { sessId: this.cookieService.get('PHPSESSID') });
  }

  /**
   * 让后端把用户退出相应的房间
   */
  unload() {
    this.emit(SocketEvent.Unload);
  }

  /**
   * 发送消息
   * @param msg
   */
  message(msg: Message) {
    this.emit(SocketEvent.Message, { msg });
  }

  /**
   * 撤回消息
   * @param chatroomId
   * @param msgId
   */
  revokeMsg(chatroomId: number, msgId: number) {
    this.emit(SocketEvent.RevokeMsg, {
      chatroomId,
      msgId
    });
  }

  /**
   * 好友申请
   * @param userId 对方的ID
   * @param targetAlias 设置好友别名
   * @param requestReason 申请原因
   */
  friendRequest(userId: number, targetAlias: string = null, requestReason: string = null) {
    this.emit(SocketEvent.FriendRequest, {
      userId,
      targetAlias,
      requestReason
    });
  }

  /**
   * 同意好友申请
   * @param friendRequestId 好友申请实体ID
   * @param selfAlias 设置好友别名
   */
  friendRequestAgree(friendRequestId: number, selfAlias: string = null) {
    this.emit(SocketEvent.FriendRequestAgree, {
      friendRequestId,
      selfAlias
    });
  }

  /**
   * 拒绝好友申请
   * @param friendRequestId 好友申请实体ID
   * @param rejectReason 拒绝原因
   */
  friendRequestReject(friendRequestId: number, rejectReason: string = null) {
    this.emit(SocketEvent.FriendRequestReject, {
      friendRequestId,
      rejectReason
    });
  }

  /**
   * 创建聊天室
   * @param name 聊天室名称
   * @param description 聊天室介绍
   */
  createChatroom(name: string, description?: string) {
    this.emit(SocketEvent.CreateChatroom, {
      name,
      description
    });
  }

  /**
   * 邀请加入群聊
   * @param chatroomId 聊天室ID
   * @param chatroomIdList 私聊聊天室的ID列表
   */
  inviteJoinChatroom(chatroomId: number, chatroomIdList: number[]) {
    this.emit(SocketEvent.InviteJoinChatroom, {
      chatroomId,
      chatroomIdList
    });
  }

  /**
   * 群聊申请
   * @param chatroomId 聊天室ID
   * @param reason 申请原因
   */
  chatRequset(chatroomId: number, reason: string = null) {
    this.emit(SocketEvent.ChatRequest, {
      chatroomId,
      reason
    });
  }

  /**
   * 同意入群申请
   * @param requestId 申请ID
   */
  chatRequsetAgree(requestId: number) {
    this.emit(SocketEvent.ChatRequestAgree, { requestId });
  }

  /**
   * 拒绝入群申请
   * @param requestId 申请ID
   * @param rejectReason 拒绝原因
   */
  chatRequestReject(requestId: number, rejectReason: string = null) {
    this.emit(SocketEvent.ChatRequestReject, {
      requestId,
      rejectReason
    });
  }

  /**
   * 发送事件
   * @param eventName 事件名
   * @param data 数据
   */
  emit(eventName: string, data?: any) {
    return this.socket.emit(eventName, data);
  }

  /**
   * 监听事件
   * @param eventName 事件名
   */
  on(eventName: string): Observable<unknown> {
    return this.socket.fromEvent(eventName);
  }

  /**
   * 断开连接
   */
  disconnect() {
    return this.socket.disconnect();
  }

}
