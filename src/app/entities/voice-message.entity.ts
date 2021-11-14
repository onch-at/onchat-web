import { MessageType } from '../common/enums';
import { VoiceMessage } from '../models/msg.model';
import { ChatRecordService } from '../services/apis/chat-record.service';
import { MessageEntity } from './message.entity';

export class VoiceMessageEntity extends MessageEntity {
  /**
   * @param file 语音文件
   * @param data 语音消息数据
   */
  constructor(private file: Blob, public data: VoiceMessage) {
    super(MessageType.Voice);
  }

  send() {
    this.track();
    this.injector.get(ChatRecordService).sendVoice(this.chatroomId, this.file, this.tempId).subscribe();
  }
}