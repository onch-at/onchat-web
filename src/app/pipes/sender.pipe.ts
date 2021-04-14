import { Pipe, PipeTransform } from '@angular/core';
import { ChatroomType } from '../common/enum';
import { ChatSession } from '../models/onchat.model';
import { GlobalData } from '../services/global-data.service';

/**
 * 解析消息会话项的的发送者名称
 */
@Pipe({
  name: 'sender'
})
export class SenderPipe implements PipeTransform {

  constructor(private globalData: GlobalData) { }

  transform(value: ChatSession): unknown {
    const { content, data } = value;
    if (content.userId === this.globalData.user.id) {
      return '';
    }

    if (data.chatroomType === ChatroomType.Private) {
      return 'Ta: '
    }

    return (content.nickname || content.userId) + ': ';
  }

}
