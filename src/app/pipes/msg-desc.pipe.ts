import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { MessageType } from '../common/enum';
import { RichTextMessage, TextMessage } from '../models/form.model';
import { Message } from '../models/onchat.model';

/**
 * 获取聊天消息的描述
 */
@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'msgDesc'
})
export class MessageDescPipe implements PipeTransform {

  transform(value: Message): string {
    switch (value.type) {
      case MessageType.Text: return (value.data as TextMessage).content;

      case MessageType.RichText: return (value.data as RichTextMessage).text;

      case MessageType.ChatInvitation: return '[分享]邀请加入群聊';

      case MessageType.Image: return '[图片]';

      default: return '[收到新消息]';
    }
  }

}
