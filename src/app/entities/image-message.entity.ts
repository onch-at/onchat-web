import { HttpEvent, HttpEventType } from '@angular/common/http';
import { of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { MessageType } from '../common/enum';
import { ImageMessage } from '../models/msg.model';
import { Message, Result } from '../models/onchat.model';
import { ChatRecordService } from '../services/apis/chat-record.service';
import { ImageService } from '../services/image.service';
import { MessageEntity } from './message.entity';

export class ImageMessageEntity extends MessageEntity {
  /** 图像文件 */
  file: Blob;
  /** 是否为原图 */
  original: boolean;
  /** 图像原URL */
  url: string;
  /** 上传进度 */
  percent: number;

  data: ImageMessage;

  constructor(file: Blob, url: string, original?: boolean) {
    super(MessageType.Image);

    this.file = file;
    this.url = url;
    this.original = original;
    this.percent = 0;
  }

  send() {
    (this.original ? of(null) : this.compress()).pipe(
      mergeMap(() => this.injector.get(ChatRecordService).sendImage(this.chatroomId, this.file, this.tempId))
    ).subscribe((event: HttpEvent<Result<Message<ImageMessage>>>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.track();
          break;

        case HttpEventType.UploadProgress:
          const { total, loaded } = event;
          if (total > 0) {
            this.percent = +(loaded / total * 100).toFixed(); // 计算进度
          }
          break;

        case HttpEventType.Response:
          // do something...
          break;
      }
    });
  }

  /**
   * 压缩图像
   */
  private compress() {
    return this.injector.get(ImageService).compress(this.url).pipe(
      tap((file: Blob) => this.file = file)
    );
  }
}