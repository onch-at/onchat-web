import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { MessageType } from '../common/enums';
import { ImageMessage } from '../models/msg.model';
import { Message, Result } from '../models/onchat.model';
import { ChatRecordService } from '../services/apis/chat-record.service';
import { ImageService } from '../services/image.service';
import { BlobUtils } from '../utilities/blob.utils';
import { MessageEntity } from './message.entity';

export class ImageMessageEntity extends MessageEntity {
  /** 上传进度 */
  percent: number = 0;
  /** 图像消息数据 */
  data: ImageMessage;

  /**
   * @param file 图像文件
   * @param url 图像原URL
   * @param original 是否为原图
   */
  constructor(
    private file: File,
    private url: string,
    private original?: boolean
  ) {
    super(MessageType.Image);
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
  private compress(): Observable<Blob> {
    return this.injector.get(ImageService).compress(this.url).pipe(
      tap((blob: Blob) => {
        this.file = BlobUtils.toFile(blob, this.file.name, this.file.lastModified);
      })
    );
  }
}