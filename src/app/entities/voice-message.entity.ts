import { MessageType } from '../common/enums';
import { VoiceMessage } from '../models/msg.model';
import { ChatRecordService } from '../services/apis/chat-record.service';
import { MessageEntity } from './message.entity';

export class VoiceMessageEntity extends MessageEntity<VoiceMessage> {
  private _blob: Blob;

  constructor(public data: VoiceMessage) {
    super(MessageType.Voice);
  }

  blob(blob: Blob) {
    this._blob = blob;
    return this;
  }

  send() {
    this.track();
    this.injector.get(ChatRecordService).sendVoice(this.chatroomId, this._blob, this.tempId).subscribe();
  }
}