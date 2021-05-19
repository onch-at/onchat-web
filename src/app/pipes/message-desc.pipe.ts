import { Pipe, PipeTransform } from '@angular/core';
import { MessageType, TipsType } from '../common/enum';
import { RichTextMessage, TextMessage, TipsMessage } from '../models/msg.model';
import { Message } from '../models/onchat.model';

@Pipe({
  name: 'messageDesc'
})
export class MessageDescPipe implements PipeTransform {

  transform(value: Message): string {
    const { type, data, nickname } = value;

    return {
      [MessageType.Text]: (data as TextMessage).content,
      [MessageType.RichText]: (data as RichTextMessage).text,
      [MessageType.Image]: '[图片]',
      [MessageType.Voice]: '[语音]',
      [MessageType.ChatInvitation]: '[分享]邀请加入聊天室',
      [MessageType.Tips]: {
        [TipsType.JoinRoom]: nickname + ' 已加入聊天室',
        [TipsType.RevokeMessage]: nickname + ' 撤回了一条消息',
      }[(data as TipsMessage).type]
    }[type] || '[收到新消息]';
  }

}
