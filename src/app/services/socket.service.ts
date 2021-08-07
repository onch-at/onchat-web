import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { filter, take, tap, timeout } from 'rxjs/operators';
import { ResultCode, SocketEvent } from '../common/enum';
import { SafeAny } from '../common/interface';
import { Message, Result } from '../models/onchat.model';
import { Overlay } from './overlay.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /** 初始化后的可观察对象 */
  private init$: Subject<void> = new Subject();

  constructor(
    private socket: Socket,
    private overlay: Overlay
  ) { }

  onInit(): Observable<void> {
    return this.init$.asObservable();
  }

  /**
   * 初始化时执行，让后端把用户加入相应的房间
   */
  init() {
    this.on(SocketEvent.Init).pipe(
      timeout(10000),
      take(1),
      filter(({ code }: Result) => code === ResultCode.Success)
    ).subscribe(() => {
      this.init$.next();
    });

    this.emit(SocketEvent.Init);
  }

  /**
   * 发送消息
   * @param msg
   */
  message(msg: Message) {
    this.emit(SocketEvent.Message, msg);
  }

  /**
   * 撤回消息
   * @param id
   * @param chatroomId
   */
  revokeMessage(id: number, chatroomId: number) {
    this.emit(SocketEvent.RevokeMessage, {
      id,
      chatroomId
    });
  }

  /**
   * 好友申请
   * @param targetId 对方的ID
   * @param targetAlias 设置好友别名
   * @param reason 申请原因
   */
  friendRequest(targetId: number, targetAlias: string = null, reason: string = null) {
    this.emit(SocketEvent.FriendRequest, {
      targetId,
      targetAlias,
      reason
    });
  }

  /**
   * 同意好友申请
   * @param requestId 好友申请实体ID
   * @param requesterAlias 设置好友别名
   */
  friendRequestAgree(requestId: number, requesterAlias: string = null) {
    this.emit(SocketEvent.FriendRequestAgree, {
      requestId,
      requesterAlias
    });
  }

  /**
   * 拒绝好友申请
   * @param requestId 好友申请实体ID
   * @param reason 拒绝原因
   */
  friendRequestReject(requestId: number, reason: string = null) {
    this.emit(SocketEvent.FriendRequestReject, {
      requestId,
      reason
    });
  }

  /**
   * 创建聊天室
   * @param name 聊天室名称
   * @param description 聊天室介绍
   */
  createChatroom(name: string, description: string = null) {
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
   * @param reason 拒绝原因
   */
  chatRequestReject(requestId: number, reason: string = null) {
    this.emit(SocketEvent.ChatRequestReject, {
      requestId,
      reason
    });
  }

  /**
   * 发送事件
   * @param eventName 事件名
   * @param data 数据
   */
  emit(eventName: string, data?: unknown) {
    return this.socket.emit(eventName, data);
  }

  /**
   * 监听事件
   * @param eventName 事件名
   */
  on(eventName: string | SocketEvent): Observable<unknown> {
    return this.socket.fromEvent(eventName).pipe(tap((data: SafeAny) => {
      data?.code === ResultCode.AccessOverclock && this.overlay.presentToast('操作失败，原因：请求频率过高');
    }));
  }

  connect() {
    return this.socket.connect();
  }

  /**
   * 断开连接
   */
  disconnect() {
    return this.socket.disconnect();
  }

}
