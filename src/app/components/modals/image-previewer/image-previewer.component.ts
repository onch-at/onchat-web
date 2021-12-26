import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetButton, Platform } from '@ionic/angular';
import { ImageMessage } from 'src/app/models/msg.model';
import { Message } from 'src/app/models/onchat.model';
import { Destroyer } from 'src/app/services/destroyer.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Overlay } from 'src/app/services/overlay.service';
import { StrUtils } from 'src/app/utilities/str.utils';
import { SysUtils } from 'src/app/utilities/sys.utils';
import Swiper, { Lazy, Zoom } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { LazyOptions, ZoomOptions } from 'swiper/types';
import { ModalComponent } from '../modal.component';

Swiper.use([Lazy, Zoom]);

@Component({
  selector: 'app-image-previewer',
  templateUrl: './image-previewer.component.html',
  styleUrls: ['./image-previewer.component.scss'],
  providers: [Destroyer]
})
export class ImagePreviewerComponent extends ModalComponent {
  @Input() data: Message<ImageMessage>[] = [];
  @Input() index: number;
  @ViewChild(SwiperComponent) swiper: SwiperComponent;

  zoom: ZoomOptions = {
    maxRatio: 5,
    minRatio: 0.75,
    toggle: true
  };

  lazy: LazyOptions = {
    preloaderClass: 'swiper-lazy-spinner'
  }

  constructor(
    private feedbackService: FeedbackService,
    private platform: Platform,
    protected overlay: Overlay,
    protected router: Router,
    protected destroyer: Destroyer,
  ) {
    super();
  }

  doMore(item: Message<ImageMessage>, event: Event) {
    event.preventDefault();

    if (event.type === 'press' && this.platform.is('desktop')) {
      return;
    }

    this.feedbackService.slightVibrate();
    this.presentActionSheet(item);
  }

  presentActionSheet(item: Message<ImageMessage>) {
    const buttons: ActionSheetButton[] = [{ text: '取消', role: 'cancel' }];

    if (StrUtils.isString(item.data.url)) {
      buttons.unshift({ text: '保存图片', handler: () => SysUtils.downloadFile((item.data as ImageMessage).url) })
    }

    this.overlay.actionSheet(buttons);
  }

}
