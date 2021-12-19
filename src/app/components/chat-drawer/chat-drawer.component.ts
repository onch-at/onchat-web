import { Component, EventEmitter, Injector, Input, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IonRouterOutlet } from '@ionic/angular';
import { filter, mergeMap, take, tap } from 'rxjs/operators';
import { Throttle } from 'src/app/common/decorators';
import { ChatroomType, SocketEvent } from 'src/app/common/enums';
import { SafeAny } from 'src/app/common/interfaces';
import { success } from 'src/app/common/operators';
import { ImageMessageEntity } from 'src/app/entities/image-message.entity';
import { MessageEntity } from 'src/app/entities/message.entity';
import { VoiceMessageEntity } from 'src/app/entities/voice-message.entity';
import { ImageMessage, VoiceMessage } from 'src/app/models/msg.model';
import { Result, User } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { MediaDevice } from 'src/app/services/media-device.service';
import { Overlay } from 'src/app/services/overlay.service';
import { Peer } from 'src/app/services/peer.service';
import { Socket } from 'src/app/services/socket.service';
import { BlobUtils } from 'src/app/utilities/blob.utils';
import { SysUtils } from 'src/app/utilities/sys.utils';
import Swiper, { Pagination } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { ChatRecorderOutputEvent } from '../chat-recorder/chat-recorder.component';
import { RichTextEditorComponent } from '../modals/rich-text-editor/rich-text-editor.component';
import { RtcComponent } from '../modals/rtc/rtc.component';

Swiper.use([Pagination]);

@Component({
  selector: 'app-chat-drawer',
  templateUrl: './chat-drawer.component.html',
  styleUrls: ['./chat-drawer.component.scss'],
})
export class ChatDrawerComponent {
  get activeIndex() { return this.swiper.swiperRef.activeIndex };
  readonly chatroomTypes: typeof ChatroomType = ChatroomType;
  /** 聊天室类型 */
  @Input() chatroomType: ChatroomType;
  @Output() msgpush: EventEmitter<MessageEntity> = new EventEmitter<MessageEntity>();
  @ViewChild(SwiperComponent) swiper: SwiperComponent;

  constructor(
    private peer: Peer,
    private overlay: Overlay,
    private injector: Injector,
    private globalData: GlobalData,
    private sanitizer: DomSanitizer,
    private mediaDevice: MediaDevice,
    private socket: Socket,
    private routerOutlet: IonRouterOutlet,
  ) { }

  slideTo(index: number, speed?: number) {
    this.swiper.swiperRef.slideTo(index, speed);
  }

  onVoiceOutput({ blob, src, duration }: ChatRecorderOutputEvent) {
    const { user, chatroomId } = this.globalData;

    const msg = new VoiceMessageEntity(blob, new VoiceMessage(src, duration)).inject(this.injector);
    msg.chatroomId = chatroomId;
    msg.userId = user.id;
    msg.avatarThumbnail = user.avatarThumbnail;

    this.msgpush.emit(msg);
  }

  editRichText() {
    this.overlay.modal({
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
    SysUtils.selectFile('image/*', true).subscribe(({ target }) => {
      const files: FileList = target.files;
      const length = files.length > 10 ? 10 : files.length;

      const handle = async (original: boolean) => {
        for (let index = 0; index < length; index++) {
          if (BlobUtils.isImage(files[index])) {
            await this.createImageMessage(files[index], original);
          }
        }
      }

      this.overlay.alert({
        header: '发送图片',
        message: '温馨提示：每次最多发送10张图片',
        cancelText: '原图发送',
        confirmText: '发送',
        cancelHandler: () => handle(true),
        confirmHandler: () => handle(false)
      });
    });
  }

  @Throttle(300)
  rtc() {
    let mediaStream: MediaStream;
    this.overlay.loading();

    this.mediaDevice.getUserMedia({ video: true, audio: { echoCancellation: true } }).pipe(
      tap(stream => {
        mediaStream = stream;
        this.peer.call(this.globalData.chatroomId);
      }),
      mergeMap(() => this.socket.on<Result<[requester: User, target: User]>>(SocketEvent.RtcCall)),
      take(1),
      success(),
      filter(({ data: [requester] }) => this.globalData.user.id === requester.id),
    ).subscribe(({ data: [_, target] }) => {
      this.overlay.modal({
        component: RtcComponent,
        componentProps: {
          target,
          mediaStream,
          isRequester: true,
        }
      });

      this.overlay.dismissLoading();
    });
  }

  createImageMessage(file: File, original: boolean) {
    original ||= BlobUtils.isAnimation(file);
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
