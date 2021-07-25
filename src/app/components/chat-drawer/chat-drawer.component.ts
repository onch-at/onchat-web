import { Component, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonRouterOutlet, IonSlides } from '@ionic/angular';
import { SafeAny } from 'src/app/common/interface';
import { ImageMessageEntity } from 'src/app/entities/image-message.entity';
import { MessageEntity } from 'src/app/entities/message.entity';
import { VoiceMessageEntity } from 'src/app/entities/voice-message.entity';
import { ImageMessage, VoiceMessage } from 'src/app/models/msg.model';
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
export class ChatDrawerComponent {
  @Output() msgpush: EventEmitter<MessageEntity> = new EventEmitter<MessageEntity>();
  @ViewChild(IonSlides, { static: true }) ionSlides: IonSlides;

  slideOpts: SwiperOptions = { initialSlide: 1 };

  constructor(
    private globalData: GlobalData,
    private sanitizer: DomSanitizer,
    private overlay: Overlay,
    private imageService: ImageService,
    private routerOutlet: IonRouterOutlet,
    private injector: Injector,
  ) { }

  setIndex(index: number, speed?: number) {
    this.ionSlides.slideTo(index, speed);
  }

  getIndex() {
    return this.ionSlides.getActiveIndex();
  }

  onVoiceOutput([voice, data]: [Blob, VoiceMessage]) {
    const { user, chatroomId } = this.globalData;

    const msg = new VoiceMessageEntity(voice, data).inject(this.injector);
    msg.chatroomId = chatroomId;
    msg.userId = user.id;
    msg.avatarThumbnail = user.avatarThumbnail;

    this.msgpush.emit(msg);
  }

  editRichText() {
    this.overlay.presentModal({
      component: RichTextEditorComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    }).then(modal => (
      modal.onWillDismiss()
    )).then(detail => {
      detail.data && this.msgpush.emit(detail.data);
    });
  }

  selectImage() {
    SysUtil.selectFile('image/*', true).subscribe(({ target }) => {
      const files: FileList = target.files;
      const length = files.length > 10 ? 10 : files.length;

      const handle = async (original: boolean) => {
        for (let index = 0; index < length; index++) {
          if (this.imageService.isImage(files[index])) {
            await this.createImageMessage(files[index], original);
          }
        }
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

  createImageMessage(file: File, original: boolean) {
    original ||= this.imageService.isAnimation(file);
    const { user, chatroomId } = this.globalData;
    const url = URL.createObjectURL(file);
    const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url) as string;
    const img = new Image();
    const msg = new ImageMessageEntity(file, url, original).inject(this.injector);

    msg.userId = user.id;
    msg.chatroomId = chatroomId;
    msg.avatarThumbnail = user.avatarThumbnail;

    return new Promise((resolve, reject) => {
      img.onload = () => {
        msg.data = new ImageMessage(safeUrl, safeUrl, img.width, img.height);
        this.msgpush.emit(msg);
        resolve(msg);
      };

      img.onerror = (error: SafeAny) => reject(error);

      img.src = url;
    });
  }
}
