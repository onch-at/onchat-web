import { Injector } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { ChatMemberRole, MessageType, ResultCode, SocketEvent } from '../common/enum';
import { AnyMessage } from '../models/msg.model';
import { Message, Result } from '../models/onchat.model';
import { SocketService } from '../services/socket.service';
import { StrUtil } from '../utils/str.util';

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
    this.tempId = tempId ?? StrUtil.random();
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
    const socketService = this.injector.get(SocketService);

    socketService.on(SocketEvent.Message).pipe(
      filter(({ code, data }: Result<Message>) => (
        code === ResultCode.Success && this.isSelf(data)
      )),
      take(1)
    ).subscribe((result: Result<Message>) => {
      const { avatarThumbnail, data, ...msg } = result.data;
      Object.assign(this, msg);
      this.loading = false;
    });

    return socketService;
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