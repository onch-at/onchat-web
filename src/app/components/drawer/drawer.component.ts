import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageType, ResultCode } from 'src/app/common/enum';
import { Message } from 'src/app/entities/message.entity';
import { ImageMessage } from 'src/app/models/form.model';
import { Result } from 'src/app/models/onchat.model';
import { ChatPage } from 'src/app/pages/chat/chat.page';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { ImageService } from 'src/app/services/image.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { SysUtil } from 'src/app/utils/sys.util';
import { RichTextEditorComponent } from '../modals/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
  @Input() page: ChatPage;

  /** 图片格式，优先级：webp -> jpeg -> png */
  private format: string = SysUtil.isSupportWEBP() ? 'webp' : SysUtil.isSupportJPEG() ? 'jpeg' : 'png';

  constructor(
    private globalData: GlobalData,
    private sanitizer: DomSanitizer,
    private overlayService: OverlayService,
    private apiService: ApiService,
    private socketService: SocketService,
    private imageService: ImageService
  ) { }

  ngOnInit() { }

  editRichText() {
    this.overlayService.presentModal({
      component: RichTextEditorComponent,
      componentProps: {
        page: this.page
      }
    });
  }

  selectImage() {
    SysUtil.selectFile('image/*', true).subscribe((event: any) => {
      const files: FileList = event.target.files;
      const length = files.length > 15 ? 15 : files.length;

      this.overlayService.presentAlert({
        header: '发送图片',
        message: '温馨提示：每次最多发送15张图片',
        cancelText: '原图发送',
        confirmText: '发送',
        cancelHandler: () => {
          for (let index = 0; index < length; index++) {
            this.uploadImage(files[index], true);
          }
        },
        confirmHandler: () => {
          for (let index = 0; index < length; index++) {
            this.uploadImage(files[index]);
          }
        }
      });
    });
  }

  private async uploadImage(file: Blob, original: boolean = false) {
    const { chatroomId } = this.page;
    const { user } = this.globalData;
    const url = URL.createObjectURL(file);
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url) as string;

    const msg = new Message(MessageType.Image);
    msg.chatroomId = chatroomId;
    msg.userId = user.id;
    msg.avatarThumbnail = user.avatarThumbnail;
    msg.data = new ImageMessage(safeUrl, safeUrl);
    msg.loading = 0.01;

    if (!original && !this.imageService.isAnimation(file)) {
      file = await this.imageService.compress(url, 0.9, this.format).toPromise();
    }

    this.apiService.uploadImageToChatroom(chatroomId, file).subscribe((event: HttpEvent<Result<string>>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          this.page.msgList.push(msg);
          this.page.scrollToBottom().then(() => {
            this.page.scrollToBottom();
          });
          break;

        case HttpEventType.UploadProgress:
          if (event.total > 0) {
            const percent = +(event.loaded / event.total * 100).toFixed(2); // 计算进度
            msg.loading = percent;
          }
          break;

        case HttpEventType.Response:
          const { code, data } = event.body;
          if (code !== ResultCode.Success) {
            this.overlayService.presentToast('图片上传失败，原因：' + event.body.msg);
          }

          msg.loading = 100.00;

          (msg.data as ImageMessage).filename = data;
          msg.send(this.socketService);
          break;
      }
    })
  }

}
