import { Injector } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { ChatMemberRole, MessageType, SocketEvent } from '../common/enums';
import { success } from '../common/operators';
import { AnyMessage } from '../models/msg.model';
import { Message, Result } from '../models/onchat.model';
import { Socket } from '../services/socket.service';
import { StrUtils } from '../utilities/str.utils';

export abstract class MessageEntity<T extends AnyMessage> implements Message {
  id: number;
  createTime: number;
  updateTime?: number;
  chatroomId: number;
  userId?: number;
  role?: ChatMemberRole;
  nickname?: string;
  avatarThumbnail?: string;
  data: T;
  replyId?: number;
  loading?: boolean;

  protected injector: Injector;

  constructor(public type: MessageType, public tempId: string = StrUtils.random()) {
    this.createTime = Date.now();
    this.loading = true;
  }

  inject(injector: Injector) {
    this.injector = injector;
    return this;
  }

  /**
   * 追踪本条消息以更新数据
   */
  protected track() {
    this.injector.get(Socket).on(SocketEvent.Message).pipe(
      success(),
      filter(({ data }: Result<Message>) => this.isSelf(data)),
      take(1)
    ).subscribe((result: Result<Message>) => {
      const { avatarThumbnail, data, ...msg } = result.data;
      Object.assign(this, msg);
      this.loading = false;
    });
  }

  /**
   * 发送消息
   */
  send() {
    this.track();
    this.injector.get(Socket).message({
      id: undefined,
      chatroomId: this.chatroomId,
      userId: this.userId,
      type: this.type,
      data: this.data,
      replyId: this.replyId,
      tempId: this.tempId,
      createTime: undefined
    });
  }

  /**
   * 目标消息是否为本身
   */
  isSelf(msg: Message) {
    return msg.chatroomId === this.chatroomId &&
      msg.tempId === this.tempId &&
      msg.userId === this.userId &&
      msg.type === this.type;
  }

}