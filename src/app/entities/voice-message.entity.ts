import { filter } from 'rxjs/operators';
import { MessageType, ResultCode } from '../common/enum';
import { VoiceMessage } from '../models/msg.model';
import { Result } from '../models/onchat.model';
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
    this.injector.get(ApiService).uploadVoiceToChatroom(this.chatroomId, this.file).pipe(
      filter((result: Result<VoiceMessage>) => result.code === ResultCode.Success)
    ).subscribe((result: Result<VoiceMessage>) => {
      Object.assign(this.data, result.data);
      super.send();
    });
  }
}