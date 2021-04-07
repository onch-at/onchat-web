import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { MessageType, ResultCode } from "../common/enum";
import { ImageMessage } from "../models/form.model";
import { Result } from "../models/onchat.model";
import { ApiService } from "../services/api.service";
import { ImageService } from "../services/image.service";
import { OverlayService } from "../services/overlay.service";
import { MessageEntity } from "./message.entity";

export class ImageMessageEntity extends MessageEntity {
  file: Blob;
  original: boolean;
  url: string;
  format: string;
  percent: number;

  data: ImageMessage;

  constructor(file: Blob, url: string, original?: boolean) {
    super(MessageType.Image);

    this.file = file;
    this.url = url;
    this.original = original;
    this.percent = 0;
  }

  compress() {
    return this.injector.get(ImageService).compress(this.url, 0.75, this.format).pipe(
      tap((file: Blob) => {
        this.file = file;
        this.original = false;
      })
    );
  }

  send() {
    return (this.original ? of(null) : this.compress()).pipe(mergeMap(() => new Observable(observer => {
      this.injector.get(ApiService).uploadImageToChatroom(this.chatroomId, this.file).subscribe((event: HttpEvent<Result<ImageMessage>>) => {
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
            observer.next();
            observer.complete();

            const { code, data, msg } = event.body;

            if (code !== ResultCode.Success) {
              this.injector.get(OverlayService).presentToast('图片上传失败，原因：' + msg);
            }

            Object.assign(this.data, data);
            super.send();
            break;
        }
      });
    })));
  }
}