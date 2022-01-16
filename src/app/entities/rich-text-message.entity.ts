import { MessageType } from '../common/enums';
import { RichTextMessage } from '../models/msg.model';
import { MessageEntity } from './message.entity';

export class RichTextMessageEntity extends MessageEntity<RichTextMessage> {

  constructor(public data: RichTextMessage) {
    super(MessageType.RichText);
  }
}