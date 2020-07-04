import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { SocketEvent } from '../common/enum';
import { Message } from '../models/form.model';

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
    this.emit(SocketEvent.Unload, { sessId: this.cookieService.get('PHPSESSID') });
  }

  /**
   * 发送消息
   * @param msg 
   */
  message(msg: Message) {
    this.emit(SocketEvent.Message, {
      sessId: this.cookieService.get('PHPSESSID'),
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
      sessId: this.cookieService.get('PHPSESSID'),
      chatroomId: +chatroomId,
      msgId: +msgId
    });
  }

  /**
   * 好友申请
   * @param userId 
   */
  friendRequest(userId: number) {
    this.emit(SocketEvent.FriendRequest, {
      sessId: this.cookieService.get('PHPSESSID'),
      userId: +userId
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
