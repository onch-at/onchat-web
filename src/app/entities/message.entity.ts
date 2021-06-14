import { Injector } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { ChatMemberRole, MessageType, ResultCode, SocketEvent } from '../common/enum';
import { AnyMessage } from '../models/msg.model';
import { Message, Result } from '../models/onchat.model';
import { SocketService } from '../services/socket.service';

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
  sendTime?: number;
  loading?: boolean;

  protected injector: Injector;

  constructor(type: MessageType = MessageType.Text) {
    this.type = type;
    this.sendTime = Date.now();
    this.createTime = this.sendTime;
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
      filter(({ code, data }: Result<Message>) => {
        return code === ResultCode.Success && this.isSelf(data);
      }),
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
      sendTime: this.sendTime,
      createTime: undefined
    });
  }

  /**
   * 目标消息是否为本身
   */
  isSelf(msg: Message) {
    return msg.chatroomId === this.chatroomId &&
      msg.sendTime === this.sendTime &&
      msg.userId === this.userId &&
      msg.type === this.type;
  }

}