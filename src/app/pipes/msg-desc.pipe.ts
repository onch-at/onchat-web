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
export class MsgDescPipe implements PipeTransform {

  transform(value: Message): string {
    return {
      [MessageType.Text]: (value.data as TextMessage).content,
      [MessageType.RichText]: (value.data as RichTextMessage).text,
      [MessageType.ChatInvitation]: '[分享]邀请加入群聊',
      [MessageType.Image]: '[图片]',
    }[value.type] || '[收到新消息]';
  }

}
