import { HttpEvent, HttpEventType } from "@angular/common/http";
import { of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { MessageType, ResultCode } from "../common/enum";
import { ImageMessage } from '../models/msg.model';
import { Result } from "../models/onchat.model";
import { ApiService } from "../services/api.service";
import { ImageService } from "../services/image.service";
import { Overlay } from "../services/overlay.service";
import { MessageEntity } from "./message.entity";

export class ImageMessageEntity extends MessageEntity {
  /** 图像文件 */
  file: Blob;
  /** 是否为原图 */
  original: boolean;
  /** 图像原URL */
  url: string;
  /** 图像格式 */
  format: string;
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

  /**
   * 压缩图像
   */
  compress() {
    return this.injector.get(ImageService).compress(this.url, 0.75, this.format).pipe(
      tap((file: Blob) => {
        this.file = file;
        this.original = false;
      })
    );
  }

  send() {
    (this.original ? of(null) : this.compress()).pipe(
      tap(() => super.track()),
      mergeMap(() => this.injector.get(ApiService).uploadImageToChatroom(this.chatroomId, this.file, this.sendTime))
    ).subscribe((event: HttpEvent<Result<ImageMessage>>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          break;

        case HttpEventType.UploadProgress:
          const { total, loaded } = event;
          if (total > 0) {
            this.percent = +(loaded / total * 100).toFixed(); // 计算进度
          }
          break;

        case HttpEventType.Response:
          const { code, data, msg } = event.body;

          if (code !== ResultCode.Success) {
            return this.injector.get(Overlay).presentToast('图片上传失败，原因：' + msg);
          }

          Object.assign(this.data, data);
          break;
      }
    });
  }
}