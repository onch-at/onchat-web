import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEvent } from '../common/enum';
import { Message } from '../models/onchat.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    private socket: Socket,
    private cookieService: CookieService,
  ) { }

  /**
   * 初始化时执行，让后端把用户加入相应的房间
   */
  init() {
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
    this.emit(SocketEvent.Message, {
      msg
    });
  }

  /**
   * 撤回消息
   * @param chatroomId 
   * @param msgId 
   */
  revokeMsg(chatroomId: number, msgId: number) {
    this.emit(SocketEvent.RevokeMsg, {
      chatroomId: +chatroomId,
      msgId: +msgId
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
      userId: +userId,
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
   * 发送事件
   * @param eventName 事件名
   * @param data 数据
   * @param callback 回调
   */
  emit(eventName: string, data?: any, callback?: CallableFunction) {
    return this.socket.emit(eventName, data, callback);
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
