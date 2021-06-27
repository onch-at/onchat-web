import { MessageType } from '../common/enum';
import { VoiceMessage } from '../models/msg.model';
import { ChatRecordService } from '../services/apis/chat-record.service';
import { MessageEntity } from './message.entity';

export class VoiceMessageEntity extends MessageEntity {
  /** 语音文件 */
  file: Blob;
  data: VoiceMessage;

  constructor(file: Blob, data: VoiceMessage) {
    super(MessageType.Voice);
    this.file = file;
    this.data = data;
  }

  send() {
    this.track();
    this.injector.get(ChatRecordService).sendVoice(this.chatroomId, this.file, this.tempId).subscribe();
  }
}