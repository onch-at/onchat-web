import { Injector } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { ChatMemberRole, MessageType, SocketEvent } from '../common/enums';
import { success } from '../common/operators';
import { AnyMessage } from '../models/msg.model';
import { Message, Result } from '../models/onchat.model';
import { Socket } from '../services/socket.service';
import { StrUtils } from '../utilities/str.utils';

export class MessageEntity implements Message {
  id: number;
  createTime: number;
  updateTime?: number;
  chatroomId: number;
  userId?: number;
  role?: ChatMemberRole;
  nickname?: string;
  avatarThumbnail?: string;
  type: MessageType;
  data: AnyMessage;
  replyId?: number;
  tempId?: string;
  loading?: boolean;

  protected injector: Injector;

  constructor(type: MessageType = MessageType.Text, tempId?: string) {
    this.type = type;
    this.tempId = tempId ?? StrUtils.random();
    this.createTime = Date.now();
    this.loading = true;
  }

  /**
   * 设置注入器
   * @param injector 注入器
   */
  inject(injector: Injector) {
    this.injector = injector;
    return this;
  }

  /**
   * 追踪本条消息以更新数据
   */
  track() {
    const socket = this.injector.get(Socket);

    socket.on(SocketEvent.Message).pipe(
      success(),
      filter(({ data }: Result<Message>) => this.isSelf(data)),
      take(1)
    ).subscribe((result: Result<Message>) => {
      const { avatarThumbnail, data, ...msg } = result.data;
      Object.assign(this, msg);
      this.loading = false;
    });

    return socket;
  }

  /**
   * 发送消息
   */
  send() {
    this.track().message({
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