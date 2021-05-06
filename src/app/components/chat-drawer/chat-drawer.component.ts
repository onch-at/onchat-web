import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonRouterOutlet, IonSlides } from '@ionic/angular';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ImageMessageEntity } from 'src/app/entities/image-message.entity';
import { VoiceMessageEntity } from 'src/app/entities/voice-message.entity';
import { ImageMessage, VoiceMessage } from 'src/app/models/msg.model';
import { ChatPage } from 'src/app/pages/chat/chat.page';
import { GlobalData } from 'src/app/services/global-data.service';
import { ImageService } from 'src/app/services/image.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SysUtil } from 'src/app/utils/sys.util';
import { SwiperOptions } from 'swiper';
import { RichTextEditorComponent } from '../modals/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-chat-drawer',
  templateUrl: './chat-drawer.component.html',
  styleUrls: ['./chat-drawer.component.scss'],
})
export class ChatDrawerComponent implements OnInit {
  @Input() page: ChatPage;
  @ViewChild(IonSlides, { static: true }) ionSlides: IonSlides;

  slideOpts: SwiperOptions = { initialSlide: 1 };

  /** 待发送的图片消息实体 队列 */
  private imgMsgQueue: ImageMessageEntity[] = [];

  /** 图片格式，优先级：webp -> jpeg -> png */
  private format: string = SysUtil.isSupportWEBP() ? 'webp' : SysUtil.isSupportJPEG() ? 'jpeg' : 'png';

  constructor(
    private globalData: GlobalData,
    private sanitizer: DomSanitizer,
    private overlay: Overlay,
    private imageService: ImageService,
    private routerOutlet: IonRouterOutlet,
    private injector: Injector
  ) { }

  ngOnInit() { }

  setIndex(index: number, speed?: number) {
    this.ionSlides.slideTo(index, speed);
  }

  getIndex() {
    return this.ionSlides.getActiveIndex();
  }

  onVoiceOutput([voice, data]: [Blob, VoiceMessage]) {
    const { chatroomId } = this.page;
    const { user } = this.globalData;

    const msg = new VoiceMessageEntity(voice, data).inject(this.injector);
    msg.chatroomId = chatroomId;
    msg.userId = user.id;
    msg.avatarThumbnail = user.avatarThumbnail;
    msg.send();

    this.page.msgList.push(msg);
    this.page.scrollToBottom();
  }

  editRichText() {
    this.overlay.presentModal({
      component: RichTextEditorComponent,
      componentProps: {
        page: this.page
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }

  selectImage() {
    SysUtil.selectFile('image/*', true).subscribe((event: any) => {
      const files: FileList = event.target.files;
      const length = files.length > 10 ? 10 : files.length;

      const handle = async (original: boolean) => {
        for (let index = 0; index < length; index++) {
          await this.createImageMessage(files[index], original || this.imageService.isAnimation(files[index]));
        }
        this.sendImageMessage();
      }

      this.overlay.presentAlert({
        header: '发送图片',
        message: '温馨提示：每次最多发送10张图片',
        cancelText: '原图发送',
        confirmText: '发送',
        cancelHandler: () => handle(true),
        confirmHandler: () => handle(false)
      });
    });
  }

  private createImageMessage(file: Blob, original: boolean) {
    const { chatroomId } = this.page;
    const { user } = this.globalData;
    const url = URL.createObjectURL(file);
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url) as string;

    const msg = new ImageMessageEntity(file, url, original).inject(this.injector);
    msg.userId = user.id;
    msg.chatroomId = chatroomId;
    msg.avatarThumbnail = user.avatarThumbnail;
    msg.format = this.format;

    return new Promise<void>(resolve => {
      const img = new Image();
      img.onload = () => {
        msg.data = new ImageMessage(safeUrl, safeUrl, img.width, img.height);

        this.page.msgList.push(msg);
        this.imgMsgQueue.push(msg);
        this.page.scrollToBottom().then(() => resolve());
      }

      img.onerror = () => resolve();

      img.src = url;
    });
  }

  /**
   * 并发发送图片，并发数：3
   */
  private sendImageMessage() {
    from(this.imgMsgQueue).pipe(
      mergeMap(o => o.send(), 3)
    ).subscribe(
      () => this.imgMsgQueue.shift(),
      () => this.imgMsgQueue.shift(),
      () => this.imgMsgQueue.length && this.sendImageMessage()
    );
  }
}
