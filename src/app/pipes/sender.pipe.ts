import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../models/onchat.model';
import { GlobalData } from '../services/global-data.service';

/**
 * 解析消息会话项的的发送者名称
 */
@Pipe({
  name: 'sender'
})
export class SenderPipe implements PipeTransform {

  constructor(private globalData: GlobalData) { }

  transform(value: Message): string {
    return (value.userId === this.globalData.user.id) ? '' : (value.nickname || value.userId) + ': ';
  }

}
