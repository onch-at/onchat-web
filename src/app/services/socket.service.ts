import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { share, tap } from 'rxjs/operators';
import { ResultCode, SocketEvent } from '../common/enums';
import { SafeAny } from '../common/interfaces';
import { Message, Result } from '../models/onchat.model';
import { Overlay } from './overlay.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /** 初始化后的可观察对象 */
  readonly initialized: Observable<Result>;

  constructor(
    private socket: Socket,
    private overlay: Overlay,
    private tokenService: TokenService,
  ) {
    this.initialized = this.on<Result>(SocketEvent.Init).pipe(share());
  }

  /**
   * 刷新令牌
   */
  refreshToken() {
    this.emit(SocketEvent.RefreshToken, {
      refreshToken: this.tokenService.folder.refresh
    });
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
  on<T = unknown>(eventName: string | SocketEvent): Observable<T> {
    return this.socket.fromEvent(eventName).pipe(tap((data: SafeAny) => {
      switch (data?.code) {
        case ResultCode.AccessOverclock:
          this.overlay.toast('OnChat：请求频率过高，请稍后再试');
          break;
      }
    }));
  }

  /**
   * 建立套接字连接
   */
  connect() {
    this.socket.ioSocket.io.opts.query = {
      token: this.tokenService.folder.access
    };

    return this.socket.connect();
  }

  /**
   * 断开连接
   */
  disconnect() {
    return this.socket.disconnect();
  }

}
