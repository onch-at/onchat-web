import { MessageType } from '../common/enum';
import { VoiceMessage } from '../models/msg.model';
import { ApiService } from '../services/api.service';
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
    super.track();
    this.injector.get(ApiService).uploadVoiceToChatroom(this.chatroomId, this.file, this.sendTime).subscribe();
  }
}