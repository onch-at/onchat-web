import { MessageType } from '../common/enums';
import { TextMessage } from '../models/msg.model';
import { MessageEntity } from './message.entity';

export class TextMessageEntity extends MessageEntity<TextMessage> {

  constructor(public data: TextMessage) {
    super(MessageType.Text);
  }
}