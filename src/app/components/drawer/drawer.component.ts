import { Component, Injector, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageMessageEntity } from 'src/app/entities/image-message.entity';
import { ImageMessage } from 'src/app/models/form.model';
import { ChatPage } from 'src/app/pages/chat/chat.page';
import { GlobalData } from 'src/app/services/global-data.service';
import { ImageService } from 'src/app/services/image.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SysUtil } from 'src/app/utils/sys.util';
import { RichTextEditorComponent } from '../modals/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
  @Input() page: ChatPage;

  private imgMsgList: ImageMessageEntity[] = [];

  /** 图片格式，优先级：webp -> jpeg -> png */
  private format: string = SysUtil.isSupportWEBP() ? 'webp' : SysUtil.isSupportJPEG() ? 'jpeg' : 'png';

  constructor(
    private globalData: GlobalData,
    private sanitizer: DomSanitizer,
    private overlayService: OverlayService,
    private imageService: ImageService,
    private injector: Injector
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

      const handle = (original?: boolean) => {
        for (let index = 0; index < length; index++) {
          this.createImageMessage(files[index], original || this.imageService.isAnimation(files[index]));
        }
        this.sendImageMessage();
      }

      this.overlayService.presentAlert({
        header: '发送图片',
        message: '温馨提示：每次最多发送15张图片',
        cancelText: '原图发送',
        confirmText: '发送',
        cancelHandler: () => handle(true),
        confirmHandler: () => handle(false)
      });
    });
  }

  private createImageMessage(file: Blob, original?: boolean) {
    const { chatroomId } = this.page;
    const { user } = this.globalData;
    const url = URL.createObjectURL(file);
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url) as string;

    const msg = new ImageMessageEntity(file, url, original).inject(this.injector);
    msg.chatroomId = chatroomId;
    msg.userId = user.id;
    msg.avatarThumbnail = user.avatarThumbnail;
    msg.data = new ImageMessage(safeUrl, safeUrl);
    msg.format = this.format;

    this.page.msgList.push(msg);
    this.imgMsgList.push(msg);
    this.page.scrollToBottom().then(() => this.page.scrollToBottom());
  }

  private sendImageMessage() {
    this.imgMsgList.length && this.imgMsgList.shift().send().subscribe(() => {
      this.sendImageMessage();
    });
  }

}
