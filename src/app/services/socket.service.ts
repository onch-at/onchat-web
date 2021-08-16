import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { filter, share, tap } from 'rxjs/operators';
import { ResultCode, SocketEvent } from '../common/enum';
import { SafeAny } from '../common/interface';
import { Message, Result } from '../models/onchat.model';
import { GlobalData } from './global-data.service';
import { Overlay } from './overlay.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  /** 初始化后的可观察对象 */
  readonly initialized: Observable<Result<{ tokenTime: number }>>;

  constructor(
    private socket: Socket,
    private router: Router,
    private overlay: Overlay,
    private globalData: GlobalData,
    private tokenService: TokenService,
  ) {
    this.initialized = this.on(SocketEvent.Init).pipe(
      share(),
      filter(({ code }: Result) => code === ResultCode.Success)
    );
  }

  /**
   * 初始化时执行，让后端把用户加入相应的房间
   */
  init() {
    this.emit(SocketEvent.Init, {
      accessToken: this.tokenService.folder.access
    });
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
  on(eventName: string | SocketEvent): Observable<unknown> {
    return this.socket.fromEvent(eventName).pipe(tap((data: SafeAny) => {
      switch (data?.code) {
        case ResultCode.AccessOverclock:
          this.overlay.presentToast('OnChat：请求频率过高，请稍后再试');
          break;

        case ResultCode.Unauthorized:
          this.overlay.presentToast('OnChat：授权令牌过期，请重新登录');
          this.globalData.reset();
          this.tokenService.clear();
          this.disconnect();
          this.router.navigateByUrl('/user/login');
          break;
      }
    }));
  }

  /**
   * 建立套接字连接
   */
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
